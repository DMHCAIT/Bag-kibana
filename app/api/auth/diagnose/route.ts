import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface AuthUser {
  id: string;
  email?: string;
  created_at: string;
  email_confirmed_at?: string;
}

interface PublicUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

export async function GET() {
  try {
    // Check auth.users table (requires admin privileges)
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();

    // Check public.users table  
    const { data: publicUsers, error: publicError } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false });

    if (authError) {
      console.error("Auth users error:", authError);
    }

    if (publicError) {
      console.error("Public users error:", publicError);
      return NextResponse.json(
        { error: "Failed to fetch public users" },
        { status: 500 }
      );
    }

    const typedAuthUsers = authUsers?.users as AuthUser[] | undefined;
    const typedPublicUsers = publicUsers as PublicUser[] | undefined;

    const authUserEmails = typedAuthUsers?.map((u: AuthUser) => u.email).filter(Boolean) || [];
    const publicUserEmails = typedPublicUsers?.map((u: PublicUser) => u.email) || [];

    // Find mismatches
    const inPublicNotInAuth = typedPublicUsers?.filter((pu: PublicUser) => 
      !authUserEmails.includes(pu.email)
    ) || [];

    const inAuthNotInPublic = typedAuthUsers?.filter((au: AuthUser) => 
      au.email && !publicUserEmails.includes(au.email)
    ) || [];

    return NextResponse.json({
      summary: {
        authUsersCount: typedAuthUsers?.length || 0,
        publicUsersCount: typedPublicUsers?.length || 0,
        mismatchCount: inPublicNotInAuth.length + inAuthNotInPublic.length
      },
      authUsers: typedAuthUsers?.map((u: AuthUser) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        email_confirmed_at: u.email_confirmed_at
      })) || [],
      publicUsers: typedPublicUsers || [],
      mismatches: {
        inPublicNotInAuth: inPublicNotInAuth,
        inAuthNotInPublic: inAuthNotInPublic.map((u: AuthUser) => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at
        }))
      },
      diagnosis: inPublicNotInAuth.length > 0 
        ? "Users exist in public.users but not in auth.users. Create auth entries via Supabase Dashboard."
        : "Users are properly synced between auth.users and public.users"
    });
  } catch (error) {
    console.error("Auth diagnosis error:", error);
    return NextResponse.json(
      { error: "Failed to diagnose authentication", details: error },
      { status: 500 }
    );
  }
}