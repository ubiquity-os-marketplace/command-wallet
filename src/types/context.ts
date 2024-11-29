import { createAdapters } from "../adapters";
import { Env } from "./env";
import { PluginSettings } from "./plugin-input";
import { Context as PluginContext } from "@ubiquity-os/plugin-sdk";
import { Command } from "./command";

export type SupportedEvents = "issue_comment.created";

export type Context<TEvents extends SupportedEvents = SupportedEvents> = PluginContext<PluginSettings, Env, Command, TEvents> & {
  adapters: ReturnType<typeof createAdapters>;
};
