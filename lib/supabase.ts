import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Global variable to track instances and prevent multiple clients
declare global {
  var __supabaseInstance: any;
  var __supabaseAdminInstance: any;
}

// Create a single instance to avoid multiple GoTrueClient warnings
export const supabase = (() => {
  if (typeof window !== 'undefined') {
    // Client-side: use global to persist across hot reloads
    if (!globalThis.__supabaseInstance) {
      globalThis.__supabaseInstance = createClient(
        supabaseUrl, 
        supabaseAnonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'kibana-auth-token'
          }
        }
      );
    }
    return globalThis.__supabaseInstance;
  } else {
    // Server-side: create fresh instance each time
    return createClient(
      supabaseUrl, 
      supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }
})();

// Admin client with service role key (for server-side operations only)
export const supabaseAdmin = (() => {
  if (typeof window !== 'undefined') {
    // Return regular client for client-side to avoid warnings
    return supabase;
  }
  
  if (!globalThis.__supabaseAdminInstance) {
    globalThis.__supabaseAdminInstance = createClient(
      supabaseUrl,
      supabaseServiceRoleKey || supabaseAnonKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  return globalThis.__supabaseAdminInstance;
})();

// Type definitions for address and order items
export type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderItem = {
  id: string;
  name: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          role: 'admin' | 'customer';
          phone_verified: boolean;
          last_login_at: string | null;
          login_count: number;
          status: 'active' | 'inactive' | 'suspended' | 'deleted';
          registration_method: 'phone' | 'email' | 'google' | 'facebook';
          ip_address: string | null;
          user_agent: string | null;
          referral_source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'customer';
          phone_verified?: boolean;
          last_login_at?: string | null;
          login_count?: number;
          status?: 'active' | 'inactive' | 'suspended' | 'deleted';
          registration_method?: 'phone' | 'email' | 'google' | 'facebook';
          ip_address?: string | null;
          user_agent?: string | null;
          referral_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          role?: 'admin' | 'customer';
          phone_verified?: boolean;
          last_login_at?: string | null;
          login_count?: number;
          status?: 'active' | 'inactive' | 'suspended' | 'deleted';
          registration_method?: 'phone' | 'email' | 'google' | 'facebook';
          ip_address?: string | null;
          user_agent?: string | null;
          referral_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          category: string;
          price: number;
          description: string;
          color: string;
          images: string[];
          stock: number;
          features: string[];
          care_instructions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          category: string;
          price: number;
          description: string;
          color: string;
          images: string[];
          stock?: number;
          features?: string[];
          care_instructions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          category?: string;
          price?: number;
          description?: string;
          color?: string;
          images?: string[];
          stock?: number;
          features?: string[];
          care_instructions?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Address;
          billing_address: Address;
          items: OrderItem[];
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_method: string;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_id: string | null;
          order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Address;
          billing_address: Address;
          items: OrderItem[];
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_method: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_id?: string | null;
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: Address;
          billing_address?: Address;
          items?: OrderItem[];
          subtotal?: number;
          shipping_fee?: number;
          total?: number;
          payment_method?: string;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          payment_id?: string | null;
          order_status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          type: 'shipping' | 'billing';
          full_name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'shipping' | 'billing';
          full_name: string;
          phone: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'shipping' | 'billing';
          full_name?: string;
          phone?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: number;
          created_at?: string;
        };
      };
    };
  };
};
