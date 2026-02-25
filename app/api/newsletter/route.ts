import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Try to insert the email
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: email.toLowerCase().trim(),
          source: "footer",
        },
      ])
      .select();

    if (error) {
      // Check for duplicate email
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      console.error("Newsletter subscription error:", error);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully subscribed to newsletter!",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to retrieve subscribers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error, count } = await supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Failed to fetch subscribers:", error);
      return NextResponse.json(
        { error: "Failed to fetch subscribers" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscribers: data,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Newsletter GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
