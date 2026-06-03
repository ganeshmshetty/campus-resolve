"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// We use the service role key to insert into Auth.js tables directly
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginAction = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid credentials." };
          default:
            return { error: "Something went wrong." };
        }
      }
      throw error; // Rethrow to Next.js if it's a redirect error
    }
  });

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerAction = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    try {
      // 1. Check if user exists
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        return { error: "User with this email already exists." };
      }

      // 2. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Insert into public.users (Auth.js table)
      const { error: insertError } = await supabaseAdmin.from("users").insert({
        email,
        name,
        password: hashedPassword,
        role: "user",
      });

      if (insertError) {
        console.error("Register Error:", insertError);
        return { error: "Failed to create account." };
      }

      return { success: true };
    } catch (error) {
      console.error(error);
      return { error: "Something went wrong." };
    }
  });

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}
