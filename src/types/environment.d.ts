declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SUPABASE_KEY: string;
      SUPABASE_URL: string;
    }
  }
}

export {};
