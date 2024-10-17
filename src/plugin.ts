import { Octokit } from "@octokit/rest";
import { createClient } from "@supabase/supabase-js";
import { Logs } from "@ubiquity-os/ubiquity-os-logger";
import { CommanderError } from "commander";
import { createAdapters } from "./adapters";
import { CommandParser } from "./handlers/command-parser";
import { Env, PluginInputs } from "./types";
import { Context } from "./types";
import { addCommentToIssue } from "./utils";

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
    logger: new Logs("info"),
    adapters: {} as ReturnType<typeof createAdapters>,
  };

  context.adapters = createAdapters(supabase, context);

  if (context.eventName === "issue_comment.created") {
    const commandParser = new CommandParser(context);
    try {
      const args = inputs.eventPayload.comment.body.trim().split(/\s+/);
      await commandParser.parse(args);
    } catch (err) {
      if (err instanceof CommanderError) {
        if (err.code !== "commander.unknownCommand") {
          await addCommentToIssue(context, `\`\`\`diff\n- ${err.message}`);
          context.logger.error(err.message);
        }
      } else {
        context.logger.error("An error occurred", { err });
        throw err;
      }
    }
  } else {
    context.logger.error(`Unsupported event: ${context.eventName}`);
  }
}
