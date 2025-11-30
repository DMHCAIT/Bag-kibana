import NextAuth, { NextAuthOptions } from 'next-auth';

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
  secret: process.env.NEXTAUTH_SECRET || 'temporary-secret-for-disabled-auth',
  callbacks: {
    async session({ session }) {
      // Return session with undefined user to indicate no authentication
      return {
        ...session,
        user: undefined,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    },
    async jwt({ token }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
