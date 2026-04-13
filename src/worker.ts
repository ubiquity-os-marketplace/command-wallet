import { createPlugin } from "@ubiquity-os/plugin-sdk";
import { Manifest, resolveRuntimeManifest } from "@ubiquity-os/plugin-sdk/manifest";
import { LogLevel } from "@ubiquity-os/ubiquity-os-logger";
import type { ExecutionContext } from "hono";
import { env } from "hono/adapter";
import manifest from "../manifest.json" with { type: "json" };
import { createAdapters } from "./adapters/index";
import { plugin } from "./plugin";
import { Command } from "./types/command";
import { SupportedEvents } from "./types/context";
import { Env, envSchema } from "./types/env";
import { PluginSettings, pluginSettingsSchema } from "./types/plugin-input";

function buildRuntimeManifest(request: Request) {
  const runtimeManifest = resolveRuntimeManifest(manifest as Manifest);
  return {
    ...runtimeManifest,
    homepage_url: new URL(request.url).origin,
  };
}

export default {
  async fetch(request: Request, serverInfo: Record<string, unknown>, executionCtx?: ExecutionContext) {
    const runtimeManifest = buildRuntimeManifest(request);
    if (new URL(request.url).pathname === "/manifest.json") {
      return Response.json(runtimeManifest);
    }

    const environment = env<Env>(request as never);
    return createPlugin<PluginSettings, Env, Command, SupportedEvents>(
      (context) => {
        return plugin({
          ...context,
          adapters: {} as ReturnType<typeof createAdapters>,
        });
      },
      runtimeManifest,
      {
        envSchema: envSchema,
        postCommentOnError: true,
        settingsSchema: pluginSettingsSchema,
        logLevel: (environment.LOG_LEVEL as LogLevel) ?? "info",
        kernelPublicKey: environment.KERNEL_PUBLIC_KEY,
        bypassSignatureVerification: (environment as Env & { NODE_ENV?: string }).NODE_ENV === "local",
      }
    ).fetch(request, serverInfo, executionCtx);
  },
};
