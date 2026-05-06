"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export const signOutUser = async () => {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    redirect("/auth/signin");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error)
      console.error("Unexpected error during sign out:", error.message);
  }
};
