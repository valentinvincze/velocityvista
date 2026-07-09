"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { ISignUpForm, AuthState } from "@/types";

export const signUpNewUser = async (
  _prevState: AuthState,
  data: ISignUpForm,
): Promise<AuthState> => {
  const supabaseAdmin = createAdminClient();

  try {
    const divisionId = data.role === "coo" ? null : data.division || null;

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email: data.emailAddress.toLowerCase(),
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
        job_title: data.jobTitle,
        role: data.role,
        division_id: divisionId,
      },
    });

    if (error) {
      console.error("Supabase sign-up error:", error.message);
      switch (error.code) {
        case "email_exists":
          return {
            success: false,
            error: "An account with this email already exists.",
          };
        default:
          return {
            success: false,
            error: "Something went wrong, please try again!",
          };
      }
    }

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof Error)
      console.error("Unexpected error during sign-up:", error.message);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
