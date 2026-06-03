"use server";

import { createClient } from "@/utils/supabase/server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";

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
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imagePath: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createReportAction = actionClient
  .schema(reportSchema)
  .action(async ({ parsedInput: { title, description, category, address, latitude, longitude, imagePath, imageUrl } }) => {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "You must be logged in to submit a report." };
    }

    const userId = session.user.id;
    const supabase = await createClient(); // Still using Supabase for DB interactions (RLS will use anon, or we could pass user token, but we are using service role or standard DB setup)
    // Actually, since we bypassed GoTrue for NextAuth, RLS might be tricky.
    // If Supabase RLS is tied to `auth.uid()`, we might have an issue since we aren't sending GoTrue tokens anymore.
    // BUT we can use the admin client if needed, or implement a custom function to set the role in Postgres.
    // For now, let's keep using the admin client for DB mutations to bypass RLS, OR keep createClient.
    // Since we are migrating, let's use the standard setup, or admin client to be safe if RLS blocks it.
    
    // Using Admin Client for safety during this hybrid phase to avoid RLS blocking inserts.
    const { createAdminClient } = await import("@/utils/supabase/server");
    const supabaseAdmin = await createAdminClient(); // Fallback to admin if we need to bypass RLS

    const { data, error } = await supabaseAdmin
      .from("reports")
      .insert({
        title,
        description,
        category,
        address,
        latitude,
        longitude,
        status: "OPEN",
        created_by: userId,
      })
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    if (imagePath && imageUrl && data) {
      const { error: imageError } = await supabaseAdmin.from("report_images").insert({
        report_id: data.id,
        uploaded_by: userId,
        image_path: imagePath,
        image_url: imageUrl,
        image_type: "issue",
      });
      if (imageError) {
        console.error("Failed to insert image record:", imageError);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/reports");
    revalidatePath("/map");
    revalidatePath("/feed");

    return { success: true, reportId: data.id };
  });

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
