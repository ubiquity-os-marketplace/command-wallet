import { Value } from "@sinclair/typebox/value";
import { Env, envValidator, PluginSettings, pluginSettingsSchema, pluginSettingsValidator } from "../types";

export function validateAndDecodeSchemas(env: Env, rawSettings: object) {
  const settings = Value.Default(pluginSettingsSchema, rawSettings) as PluginSettings;

  if (!pluginSettingsValidator.test(settings)) {
    const errorDetails: object[] = [];
    for (const error of pluginSettingsValidator.errors(settings)) {
      const errorMessage = { path: error.path, message: error.message, value: error.value };
      console.error(errorMessage);
      errorDetails.push(errorMessage);
    }
    return new Response(JSON.stringify({ message: `Bad Request: the settings are invalid.`, errors: errorDetails }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const decodedSettings = Value.Decode(pluginSettingsSchema, settings);

  if (!envValidator.test(env)) {
    const errorDetails: object[] = [];
    for (const error of envValidator.errors(env)) {
      const errorMessage = { path: error.path, message: error.message, value: error.value };
      console.error(errorMessage);
      errorDetails.push(errorMessage);
    }
    return new Response(JSON.stringify({ message: `Bad Request: the environment is invalid.`, errors: errorDetails }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const decodedEnv = Value.Decode(envValidator.schema, env);

  return { decodedEnv, decodedSettings };
}
