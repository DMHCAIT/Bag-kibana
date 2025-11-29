import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          console.log("Attempting authentication for:", credentials.email);
          
          // Get user from Supabase auth
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (authError || !authData.user) {
            console.error("Auth error:", authError?.message);
            
            // Check if user exists in public.users but not in auth.users
            const { data: publicUser, error: publicUserError } = await supabaseAdmin
              .from("users")
              .select("email, role")
              .eq("email", credentials.email.toLowerCase())
              .single();
            
            if (publicUser && !publicUserError) {
              console.error(`User ${credentials.email} exists in public.users but not in auth.users. Please create auth entry.`);
            }
            
            return null;
          }

          // Get user profile from public.users table
          const { data: userData, error: userError } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (userError || !userData) {
            console.error("User profile error:", userError?.message);
            console.log("Auth user ID:", authData.user.id, "Email:", authData.user.email);
            
            // Create basic user object if profile doesn't exist
            return {
              id: authData.user.id,
              email: authData.user.email!,
              name: authData.user.email!.split('@')[0],
              role: "customer",
            };
          }

          console.log("Authentication successful for:", userData.email, "Role:", userData.role);

          return {
            id: userData.id,
            email: userData.email,
            name: userData.full_name,
            role: userData.role,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "customer";
      }
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log("Sign in event:", message.user.email);
    },
    async signOut(message) {
      console.log("Sign out event");
    },
    async createUser(message) {
      console.log("User created:", message.user.email);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
