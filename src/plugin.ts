import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";
import { CommanderError } from "commander";
import { createAdapters } from "./adapters";
import { CommandParser } from "./handlers/command-parser";
import { Env, PluginInputs } from "./types";
import { Context } from "./types";

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
      debug(message: unknown, ...optionalParams: unknown[]) {
        console.debug(message, ...optionalParams);
      },
      async info(message: unknown, ...optionalParams: unknown[]) {
        console.log(message, ...optionalParams);
        octokit.issues
          .createComment({
            owner: context.payload.repository.owner.login,
            issue_number: context.payload.issue.number,
            repo: context.payload.repository.name,
            body: `\`\`\`diff\n${message} ${optionalParams}`,
          })
          .catch((e) => console.error("Failed to post info comment", e));
      },
      warn(message: unknown, ...optionalParams: unknown[]) {
        console.warn(message, ...optionalParams);
      },
      async error(message: unknown, ...optionalParams: unknown[]) {
        console.error(message, ...optionalParams);
        octokit.issues
          .createComment({
            owner: context.payload.repository.owner.login,
            issue_number: context.payload.issue.number,
            repo: context.payload.repository.name,
            body: `\`\`\`diff\n- ${message} ${optionalParams}`,
          })
          .catch((e) => console.error("Failed to post fatal comment", e));
      },
      fatal(message: unknown, ...optionalParams: unknown[]) {
        console.error(message, ...optionalParams);
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
          context.logger.fatal(e);
        }
      } else {
        context.logger.error("error", e);
        throw e;
      }
    }
  } else {
    context.logger.error(`Unsupported event: ${context.eventName}`);
  }
}
