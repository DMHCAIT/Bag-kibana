"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

