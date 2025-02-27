"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./database.types";

export const supabase = createClientComponentClient<Database>();

export const getServerSupabaseClient = async () => {
  const { createServerComponentClient } = await import(
    "@supabase/auth-helpers-nextjs"
  );
  const { cookies } = await import("next/headers");

  return createServerComponentClient<Database>({ cookies });
};
