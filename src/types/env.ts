import { Type as T } from "@sinclair/typebox";
import { StaticDecode } from "@sinclair/typebox";

export const envSchema = T.Object({
  SUPABASE_URL: T.String(),
  SUPABASE_KEY: T.String(),
  KERNEL_PUBLIC_KEY: T.Optional(T.String()),
  UOS_AI_TOKEN: T.Optional(T.String()),
  LOG_LEVEL: T.Optional(T.String()),
});

export type Env = StaticDecode<typeof envSchema>;
