import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced validation for production readiness
if (!supabaseUrl) {
  console.error("CRITICAL ERROR: VITE_SUPABASE_URL is not defined in the environment variables.");
}
if (!supabaseAnonKey) {
  console.error("CRITICAL ERROR: VITE_SUPABASE_ANON_KEY is not defined in the environment variables.");
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create the client with specific configuration for better session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});