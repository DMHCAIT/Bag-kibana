"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signInWithPhone: (phone: string, password: string) => Promise<{success: boolean; error?: string}>;
  signUp: (name: string, email: string, phone: string, password: string) => Promise<{success: boolean; error?: string}>;
  requestOTP: (phone: string) => Promise<{success: boolean; error?: string}>;
  signInWithOTP: (phone: string, otp: string) => Promise<{success: boolean; error?: string}>;
  signUpWithOTP: (name: string, email: string, phone: string, otp: string) => Promise<{success: boolean; error?: string}>;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('kibana_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Create user object from Supabase session
        const supabaseUser: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
          phone: session.user.phone || '',
          createdAt: session.user.created_at,
        };
        
        localStorage.setItem('kibana_user', JSON.stringify(supabaseUser));
        setUser(supabaseUser);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('kibana_user');
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (name: string, email: string, phone: string, password: string) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('kibana_users') || '[]');
      
      // Check if user already exists by email
      if (existingUsers.some((u: any) => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      // Check if phone number already exists
      if (existingUsers.some((u: any) => u.phone === phone)) {
        return { success: false, error: 'Mobile number already registered' };
      }

      // Create new user
      const newUser: User = {
        id: `USER-${Date.now()}`,
        email,
        name,
        phone,
        createdAt: new Date().toISOString(),
      };

      // Save user with password (in production, use proper backend with hashing)
      const userWithPassword = { ...newUser, password };
      existingUsers.push(userWithPassword);
      localStorage.setItem('kibana_users', JSON.stringify(existingUsers));

      // Save current user session
      localStorage.setItem('kibana_user', JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('kibana_users') || '[]');
      
      // Find user with matching credentials
      const user = existingUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Remove password before storing in session
      const { password: _, ...userWithoutPassword } = user;
      
      // Save current user session
      localStorage.setItem('kibana_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('kibana_users') || '[]');
      
      // Find user with matching phone and password
      const user = existingUsers.find(
        (u: any) => u.phone === phone && u.password === password
      );

      if (!user) {
        return { success: false, error: 'Invalid mobile number or password' };
      }

      // Remove password before storing in session
      const { password: _, ...userWithoutPassword } = user;
      
      // Save current user session
      localStorage.setItem('kibana_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const requestOTP = async (phone: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\s+/g, '') })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }

      // In development, show OTP in console
      if (data.otp) {
        console.log(`Development OTP for ${phone}: ${data.otp}`);
        alert(`Development Mode - OTP: ${data.otp}`);
      }

      return { success: true };
    } catch (error) {
      console.error('OTP request error:', error);
      return { success: false, error: 'Failed to send OTP' };
    }
  };

  const signInWithOTP = async (phone: string, otp: string) => {
    try {
      // First verify the OTP
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\s+/g, ''), otp })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        return { success: false, error: verifyData.error || 'Invalid OTP' };
      }

      // Check if user exists
      const existingUsers = JSON.parse(localStorage.getItem('kibana_users') || '[]');
      let user = existingUsers.find((u: any) => u.phone === phone.replace(/\s+/g, ''));
      
      // If user doesn't exist, create a new account automatically
      if (!user) {
        const newUser: User = {
          id: `USER-${Date.now()}`,
          email: '',
          name: '',
          phone: phone.replace(/\s+/g, ''),
          createdAt: new Date().toISOString(),
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('kibana_users', JSON.stringify(existingUsers));
        user = newUser;
      }

      // Remove password before storing in session (if it exists)
      const { password: _, ...userWithoutPassword } = user;
      
      // Save current user session
      localStorage.setItem('kibana_user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);

      return { success: true };
    } catch (error) {
      console.error('OTP sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signUpWithOTP = async (name: string, email: string, phone: string, otp: string) => {
    try {
      // First verify the OTP
      const verifyResponse = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\s+/g, ''), otp })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        return { success: false, error: verifyData.error || 'Invalid OTP' };
      }

      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('kibana_users') || '[]');
      const normalizedPhone = phone.replace(/\s+/g, '');
      
      // Check if user already exists by email or phone
      if (existingUsers.some((u: any) => u.email === email)) {
        return { success: false, error: 'Email already registered' };
      }
      
      if (existingUsers.some((u: any) => u.phone === normalizedPhone)) {
        return { success: false, error: 'Mobile number already registered' };
      }

      // Create new user
      const newUser: User = {
        id: `USER-${Date.now()}`,
        email,
        name,
        phone: normalizedPhone,
        createdAt: new Date().toISOString(),
      };

      // Save user (no password needed for OTP signup)
      const userWithoutPassword = { ...newUser, password: `otp_user_${Date.now()}` };
      existingUsers.push(userWithoutPassword);
      localStorage.setItem('kibana_users', JSON.stringify(existingUsers));

      // Save current user session
      localStorage.setItem('kibana_user', JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('OTP sign up error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('kibana_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signInWithPhone,
      signUp,
      requestOTP,
      signInWithOTP,
      signUpWithOTP,
      signOut,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

