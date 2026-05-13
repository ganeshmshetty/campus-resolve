"use server";

import { createClient, createAdminClient } from "@/utils/supabase/server";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  });

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "user",
        },
      },
    });

    if (authError) {
      return { error: authError.message };
    }

    if (authData.user) {
      // Create profile record using admin client to bypass RLS and ensure creation
      const adminSupabase = await createAdminClient();
      const { error: profileError } = await adminSupabase.from("profiles").insert({
        id: authData.user.id,
        name,
        email,
        role: "user",
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // We don't return error here because the user is already created in Auth
        // and might just need a profile fixup later, or we could handle it differently.
      }
    }

    return { success: true };
  });
