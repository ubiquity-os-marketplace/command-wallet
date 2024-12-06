import { createClient } from "@supabase/supabase-js";
import { CommanderError } from "commander";
import { createAdapters } from "./adapters";
import { CommandParser } from "./handlers/command-parser";
import { Context } from "./types";
import { addCommentToIssue } from "./utils";
import { handleCommand } from "./handlers/query-wallet";

/**
 * How a worker executes the plugin.
 */
export async function plugin(context: Context) {
  const supabase = createClient(context.env.SUPABASE_URL, context.env.SUPABASE_KEY);
  context.adapters = createAdapters(supabase, context);

  if (context.command) {
    await handleCommand(context);
    return;
  }

  if (context.eventName === "issue_comment.created") {
    const commandParser = new CommandParser(context);
    try {
      const args = context.payload.comment.body.trim().split(/\s+/);
      await commandParser.parse(args);
    } catch (err) {
      if (err instanceof CommanderError) {
        if (err.code !== "commander.unknownCommand") {
          await addCommentToIssue(context, context.logger.error(err.message).logMessage.diff);
        }
      } else {
        throw context.logger.error(`An error occurred: ${err}`, { err });
      }
    }
  } else {
    context.logger.error(`Unsupported event: ${context.eventName}`);
  }
}
