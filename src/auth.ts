import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// We use the service role key to bypass RLS for Auth.js operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { db: { schema: "next_auth" } }
);

// We need a separate client for public schema (e.g., profiles)
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. Check if user exists in the new Auth.js users table
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (user && user.password) {
          // Verify password
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: user.role,
            };
          }
          return null; // Invalid password
        }

        // 2. FALLBACK: Check old Supabase GoTrue Auth (On-the-fly Migration)
        // If the user isn't in the new system (or has no password set there),
        // we try logging them into the old system.
        const supabaseAnon = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: oldAuthData, error } = await supabaseAnon.auth.signInWithPassword({
          email,
          password,
        });

        if (oldAuthData?.user && !error) {
          // Old login successful! Let's migrate them to the new system.
          // Get their old profile data
          const { data: oldProfile } = await supabasePublic
            .from("profiles")
            .select("*")
            .eq("id", oldAuthData.user.id)
            .single();

          const hashedPassword = await bcrypt.hash(password, 10);
          
          // Create the user in the new Auth.js table
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              id: oldAuthData.user.id, // Keep the same ID to maintain foreign keys!
              email: email,
              name: oldProfile?.name || email.split("@")[0],
              password: hashedPassword,
              role: oldProfile?.role || "user",
            })
            .select()
            .single();

          if (!insertError && newUser) {
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  session: {
    strategy: "jwt", // Use JWTs for sessions to keep edge compatibility
  },
  trustHost: true,
  debug: true,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initially, when user logs in, append data to token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
      }
      return token;
    },
    async session({ session, token }) {
      // Pass token data to the session object
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
});
