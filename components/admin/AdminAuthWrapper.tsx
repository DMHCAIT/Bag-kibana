"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminAuthWrapper({ children, fallback }: AdminAuthWrapperProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/admin/login');
      } else if (!isAdmin) {
        console.log('User is not admin, redirecting to home');
        router.push('/');
      } else {
        console.log('Admin authenticated:', user.email);
      }
    }
  }, [isLoading, user, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <a href="/admin/login" className="text-blue-600 hover:underline">
            Go to Admin Login
          </a>
        </div>
      </div>
    );
  }

  console.log('Rendering admin content for:', user.email);
  return <>{children}</>;
}