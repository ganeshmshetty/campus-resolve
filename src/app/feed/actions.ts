"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function toggleVoteAction(reportId: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "You must be logged in to vote." };
  }

  const { createAdminClient } = await import("@/utils/supabase/server");
  const supabaseAdmin = await createAdminClient();

  // Check if vote already exists
  const { data: existing } = await supabaseAdmin
    .from("report_votes")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // Remove vote
    await supabaseAdmin.from("report_votes").delete().eq("id", existing.id);
  } else {
    // Add vote
    await supabaseAdmin.from("report_votes").insert({
      report_id: reportId,
      user_id: user.id,
    });
  }

  revalidatePath("/feed");
  revalidatePath(`/reports/${reportId}`);
  return { success: true, voted: !existing };
}

export async function addCommentAction(reportId: string, content: string) {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return { error: "You must be logged in to comment." };
  }

  if (!content || content.trim().length < 3) {
    return { error: "Comment must be at least 3 characters." };
  }

  const { createAdminClient } = await import("@/utils/supabase/server");
  const supabaseAdmin = await createAdminClient();

  const { error } = await supabaseAdmin.from("report_comments").insert({
    report_id: reportId,
    user_id: user.id,
    content: content.trim(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/feed");
  revalidatePath(`/reports/${reportId}`);
  return { success: true };
}
