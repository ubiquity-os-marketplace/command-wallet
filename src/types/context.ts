import { Octokit } from "@octokit/rest";
import { EmitterWebhookEvent as WebhookEvent, EmitterWebhookEventName as WebhookEventName } from "@octokit/webhooks";
import { createAdapters } from "../adapters";
import { Env } from "./env";
import { PluginSettings } from "./plugin-inputs";

export type SupportedEventsU = "issue_comment.created";

export type SupportedEvents = {
  [K in SupportedEventsU]: K extends WebhookEventName ? WebhookEvent<K> : never;
};

export interface Context<T extends SupportedEventsU = SupportedEventsU, TU extends SupportedEvents[T] = SupportedEvents[T]> {
  eventName: T;
  payload: TU["payload"];
  octokit: InstanceType<typeof Octokit>;
  adapters: ReturnType<typeof createAdapters>;
  config: PluginSettings;
  env: Env;
  logger: {
    fatal: (message: string) => void;
    error: (message: string) => Promise<void>;
    warn: (message: string) => void;
    info: (message: string) => Promise<void>;
    ok: (message: string) => Promise<void>;
    debug: (message: string) => void;
  };
}
