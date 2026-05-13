"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleVoteAction(reportId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to vote." };
  }

  // Check if vote already exists
  const { data: existing } = await supabase
    .from("report_votes")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    // Remove vote
    await supabase.from("report_votes").delete().eq("id", existing.id);
  } else {
    // Add vote
    await supabase.from("report_votes").insert({
      report_id: reportId,
      user_id: user.id,
    });
  }

  revalidatePath("/feed");
  revalidatePath(`/reports/${reportId}`);
  return { success: true, voted: !existing };
}

export async function addCommentAction(reportId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to comment." };
  }

  if (!content || content.trim().length < 3) {
    return { error: "Comment must be at least 3 characters." };
  }

  const { error } = await supabase.from("report_comments").insert({
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
