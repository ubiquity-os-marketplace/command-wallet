import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "../types";
import { Wallet } from "./supabase/helpers/wallet";

export function createAdapters(supabaseClient: SupabaseClient, context: Context) {
  return {
    supabase: {
      wallet: new Wallet(supabaseClient, context),
    },
  };
}
