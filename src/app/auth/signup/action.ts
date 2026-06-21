"use server";

import { createClient } from "@/lib/supabase/server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import type { ISignUpForm, AuthState } from "@/types";

export const signUpNewUser = async (
  _prevState: AuthState,
  data: ISignUpForm,
): Promise<AuthState> => {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signUp({
      email: data.emailAddress.toLowerCase(),
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          job_title: data.jobTitle,
          role: data.role,
          division_id: data.role === "coo" ? null : data.division || null,
        },
      },
    });

    if (error) {
      console.error("Supabase sign-up error:", error.message);
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

    redirect("/dashboard");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof Error)
      console.error("Unexpected error during sign-up:", error.message);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
