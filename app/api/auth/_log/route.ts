import { NextRequest, NextResponse } from 'next/server';

// Stub NextAuth logging endpoint to prevent errors
// Authentication logging is currently disabled

export async function POST(request: NextRequest) {
  // Simply return success - no logging needed
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 });
}

