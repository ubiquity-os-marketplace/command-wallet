import { Context } from "./types";

export async function addCommentToIssue(context: Context, message: string | null) {
  if (!message) {
    context.logger.error("Message is not defined");
    return;
  }

  const { payload } = context;
  try {
    await context.octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      issue_number: payload.issue.number,
      repo: payload.repository.name,
      body: message,
    });
  } catch (err: unknown) {
    throw new Error(context.logger.error("Failed to post comment", { error: err as Error }).logMessage.raw);
  }
}
