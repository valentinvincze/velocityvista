"use server";

import { createClient } from "@/lib/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import type { ISignInForm, AuthState } from "@/types";

export const signInUser = async (
  _prevState: AuthState,
  data: ISignInForm,
): Promise<AuthState> => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: data.emailAddress.toLowerCase(),
      password: data.password,
    });

    if (error) {
      console.error("Supabase sign-in error:", error.message);
      switch (error.code) {
        case "anonymous_provider_disabled":
          return {
            success: false,
            error: "Please fill out all fields!",
          };
        default:
          return {
            success: false,
            error: "Something went wrong, please try again!",
          };
      }
    }

    const role = user?.app_metadata?.role;

    role === "rep" ? redirect("/dashboard") : redirect("/dashboard/admin");
    return null;
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error) {
      console.error("Unexpected error during sign in:", error.message);
    }
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
