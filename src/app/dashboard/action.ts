"use server";

import type { ILogSale } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const logSaleSchema = z.object({
  amount: z.number().positive(),
  title: z.string().min(1),
  status: z.enum(["secured", "lost"]),
  closing_date: z.string().min(1),
});

export const logSale = async (_prevState: unknown, data: ILogSale) => {
  const supabase = await createClient();

  const parsed = logSaleSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Invalid input." };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("division_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profileData?.division_id)
    return { success: false, error: "Failed to fetch profile." };

  try {
    const { error } = await supabase.from("sales").insert({
      rep_id: user.id,
      division_id: profileData?.division_id,
      amount: parsed.data.amount,
      title: parsed.data.title,
      status: parsed.data.status,
      closing_date: parsed.data.closing_date,
    });

    if (error) {
      console.error("Supabase sale insert error: ", error.message);
      return { success: false, error: "Failed to log sale." };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof Error)
      console.error("Unexpected error during sales table population: ", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};
