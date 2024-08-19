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
    logger: new Logs(LOG_LEVEL.INFO),
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
          context.logger.error(e.message);
        }
      } else {
        context.logger.error("Error", { e });
        throw e;
      }
    }
  } else {
    context.logger.info(`Unsupported event: ${context.eventName}`);
  }
}
