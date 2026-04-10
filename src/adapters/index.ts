import { SupabaseClient } from "@supabase/supabase-js";
import type { Context } from "../types/index";
import { Wallet } from "./supabase/helpers/wallet";

export function createAdapters(supabaseClient: SupabaseClient, context: Context) {
  return {
    supabase: {
      wallet: new Wallet(supabaseClient, context),
    },
  };
}
