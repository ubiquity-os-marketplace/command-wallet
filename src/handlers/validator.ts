import { Value, ValueError } from "@sinclair/typebox/value";
import { Env, envValidator, PluginSettings, pluginSettingsSchema, pluginSettingsValidator } from "../types";

export function validateAndDecodeSchemas(env: Env, rawSettings: object) {
  const errors: ValueError[] = [];
  const settings = Value.Default(pluginSettingsSchema, rawSettings) as PluginSettings;

  if (!pluginSettingsValidator.test(settings)) {
    for (const error of pluginSettingsValidator.errors(settings)) {
      console.error(error);
      errors.push(error);
    }
  }

  if (!envValidator.test(env)) {
    for (const error of envValidator.errors(env)) {
      console.error(error);
      errors.push(error);
    }
  }

  if (errors.length) {
    // throw errors;
  }

  try {
    const decodedEnv = Value.Decode(envValidator.schema, env);
    const decodedSettings = Value.Decode(pluginSettingsSchema, settings);
    return { decodedEnv, decodedSettings };
  } catch (e) {
    console.error("Failed to decode schemas", e);
    throw { errors: e };
  }
}
