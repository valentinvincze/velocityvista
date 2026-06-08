"use server";

import type { ICreateDivision, ISendToken } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export const logDivision = async (
  _prevState: unknown,
  data: ICreateDivision,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const { error } = await supabase.from("divisions").insert({
      created_by: user.id,
      name: data.div_name,
    });

    if (error) {
      console.error("Supabase division insert error:", error.message);
      return { success: false, error: "Failed to add division." };
    }

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Unexpected error during division table population:",
        error,
      );
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendToken = async (_prevState: unknown, data: ISendToken) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const today = new Date();

  try {
    const { data: invite, error } = await supabase
      .from("invites")
      .insert({
        email: data.emailAddress,
        expires_at: new Date(today.setHours(today.getHours() + 24)),
      })
      .select();

    if (error) {
      console.error("Supabase invite insert error:", error.message);
      return { success: false, error: "Failed to add invite." };
    }

    const signupUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?token=${invite[0].token}`;

    const { error: resendError } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: data.emailAddress,
      subject: "Velocity Vista — Signup Access",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;color:#111;">
          <p style="margin:0 0 8px 0;font-size:14px;">Your signup token:</p>
          <p style="margin:0 0 24px 0;font-size:16px;font-weight:600;letter-spacing:0.5px;">${invite[0].token}</p>
          <p style="margin:0 0 8px 0;font-size:14px;">Use the link below to access the signup page — the token is pre-filled:</p>
          <a href="${signupUrl}" style="display:inline-block;font-size:13px;color:#555;word-break:break-all;margin-bottom:24px;">${signupUrl}</a>
          <p style="margin:0;font-size:13px;font-weight:600;color:#cc0000;">This token expires in 24 hours.</p>
        </div>
      `,
    });

    if (resendError) {
      console.error("Resend error:", resendError.message);
      return { success: false, error: "Failed to send invite token." };
    }

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error during invites table population:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};

export const terminateContract = async (id: string) => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      console.error("Supabase profiles delete error:", error.message);
      return { success: false, error: "Failed to delete profile." };
    }

    const { error: adminError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (adminError) {
      console.error("Supabase deleteUser error:", adminError.message);
      return { success: false, error: "Failed to delete user." };
    }

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Unexpected error during profiles table delete operation:",
        error,
      );
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};
