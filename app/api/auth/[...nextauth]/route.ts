import NextAuth, { NextAuthOptions } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

// Minimal NextAuth configuration to prevent client errors
// Authentication is currently disabled
const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'temporary-secret-for-stub',
  callbacks: {
    async session() {
      return { user: null, expires: '' };
    },
    async jwt() {
      return {};
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
