import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Server error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}