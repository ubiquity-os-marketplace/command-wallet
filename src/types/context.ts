import { createAdapters } from "../adapters/index";
import type { Env } from "./env";
import type { PluginSettings } from "./plugin-input";
import type { Context as PluginContext } from "@ubiquity-os/plugin-sdk";
import type { Command } from "./command";

export type SupportedEvents = "issue_comment.created";

export type Context<TEvents extends SupportedEvents = SupportedEvents> = PluginContext<PluginSettings, Env, Command, TEvents> & {
  adapters: ReturnType<typeof createAdapters>;
};
