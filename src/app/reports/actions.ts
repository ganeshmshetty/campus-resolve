"use server";

import { createClient } from "@/utils/supabase/server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "waste",
    "water",
    "roads",
    "streetlights",
    "drainage",
    "sanitation",
    "safety",
    "other",
  ]),
  address: z.string().min(5, "Address is required"),
  // GPS optional for now
});

export const createReportAction = actionClient
  .schema(reportSchema)
  .action(async ({ parsedInput: { title, description, category, address } }) => {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "You must be logged in to submit a report." };
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        title,
        description,
        category,
        address,
        status: "OPEN",
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/reports");

    return { success: true, reportId: data.id };
  });

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/");
};
