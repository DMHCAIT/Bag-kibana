"use client";

// Removed SessionProvider as authentication is not currently active
// If you need authentication in the future, uncomment and configure NextAuth properly

export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
