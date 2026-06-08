"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const addProfilePicture = async (
  _prevState: unknown,
  formData: FormData,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const publicUrl = formData.get("avatar_url");

  if (!(publicUrl instanceof File)) {
    return null;
  }

  try {
    const { error: uploadError } = await supabase.storage
      .from("avatar")
      .upload(`${user.id}/avatar.png`, publicUrl, {
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase avatar_url upload error:", uploadError.message);
      return { success: false, error: uploadError };
    }

    const {
      data: { publicUrl: avatar_url },
    } = supabase.storage.from("avatar").getPublicUrl(`${user.id}/avatar.png`);

    const { error: insertError } = await supabase
      .from("profiles")
      .update({ avatar_url })
      .eq("id", user.id);

    if (insertError) {
      console.error("Supabase avatar_url insert error:", insertError.message);
      return { success: false, error: "Failed to add avatar_url." };
    }

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error during avatar_url addition:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};

export const removeProfilePicture = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const { error: removeError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);

    if (removeError) {
      console.error("Supabase avatar_url remove error:", removeError.message);
      return { success: false, error: "Failed to remove avatar_url." };
    }

    const { error: removeBucketError } = await supabase.storage
      .from("avatar")
      .remove([`${user.id}/avatar.png`]);

    if (removeBucketError) {
      console.error(
        "Supabase avatar_url remove from bucket error:",
        removeBucketError.message,
      );
      return {
        success: false,
        error: "Failed to remove avatar_url from bucket.",
      };
    }

    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error during avatar_url addition:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  }
};
