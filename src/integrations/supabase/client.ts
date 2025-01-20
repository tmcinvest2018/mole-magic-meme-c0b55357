import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wgwydutprjifaujjruli.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnd3lkdXRwcmppZmF1ampydWxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NDg3MTMsImV4cCI6MjA1MjAyNDcxM30.IF34mqnQKscToTQLovwZlOZfezHw-AIInD8TVvv_uU0";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});