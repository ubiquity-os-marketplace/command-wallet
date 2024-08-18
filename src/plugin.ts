import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";
import { CommanderError } from "commander";
import { createAdapters } from "./adapters";
import { CommandParser } from "./handlers/command-parser";
import { Env, PluginInputs } from "./types";
import { Context } from "./types";
import { Logs, LOG_LEVEL } from "@ubiquity-dao/ubiquibot-logger";

/**
 * How a worker executes the plugin.
 */
export async function plugin(inputs: PluginInputs, env: Env) {
  const octokit = new Octokit({ auth: inputs.authToken });
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  const context: Context = {
    eventName: inputs.eventName,
    payload: inputs.eventPayload,
    config: inputs.settings,
    octokit,
    env,
    logger: {
      debug(message: string) {
        const logger = new Logs(LOG_LEVEL.DEBUG);
        logger.debug(message);
      },
      async ok(message: string) {
        const logger = new Logs(LOG_LEVEL.INFO);
        logger.ok(message);
        try {
          await octokit.issues.createComment({
            owner: context.payload.repository.owner.login,
            issue_number: context.payload.issue.number,
            repo: context.payload.repository.name,
            body: `\`\`\`diff\n+ ${message}`,
          });
        } catch (e) {
          logger.error(`Failed to post ok comment ${e}`);
        }
      },
      async info(message: string) {
        const logger = new Logs(LOG_LEVEL.INFO);
        logger.info(message);
        try {
          await octokit.issues.createComment({
            owner: context.payload.repository.owner.login,
            issue_number: context.payload.issue.number,
            repo: context.payload.repository.name,
            body: `\`\`\`\n# ${message}`,
          });
        } catch (e) {
          await context.logger.error(`Failed to post info comment: ${e}`);
        }
      },
      warn(message) {
        const logger = new Logs(LOG_LEVEL.ERROR);
        logger.error(message);
      },
      async error(message: string) {
        const logger = new Logs(LOG_LEVEL.ERROR);
        logger.error(message);
        try {
          await octokit.issues.createComment({
            owner: context.payload.repository.owner.login,
            issue_number: context.payload.issue.number,
            repo: context.payload.repository.name,
            body: `\`\`\`\n- ${message}`,
          });
        } catch (e) {
          await context.logger.error(`Failed to post error comment ${e}`);
        }
      },
      fatal(message: string) {
        const logger = new Logs(LOG_LEVEL.ERROR);
        logger.fatal(message);
      },
    },
    adapters: {} as ReturnType<typeof createAdapters>,
  };

  context.adapters = createAdapters(supabase, context);

  if (context.eventName === "issue_comment.created") {
    const commandParser = new CommandParser(context);
    try {
      const args = inputs.eventPayload.comment.body.trim().split(/\s+/);
      await commandParser.parse(args);
    } catch (e) {
      if (e instanceof CommanderError) {
        if (e.code !== "commander.unknownCommand") {
          await context.logger.error(e.message);
        }
      } else {
        await context.logger.error(`${e}`);
        throw e;
      }
    }
  } else {
    await context.logger.info(`Unsupported event: ${context.eventName}`);
  }
}
