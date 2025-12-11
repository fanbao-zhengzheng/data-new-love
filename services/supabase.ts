import { createClient } from '@supabase/supabase-js';

// REPLACE THESE WITH YOUR OWN SUPABASE PROJECT CREDENTIALS
// Ideally, use import.meta.env.VITE_SUPABASE_URL in a real Vite project
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xmbdhsiopgklunsplimh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_KEY || 'sb_publishable_Z0q1-9gRfvRsl_U5W9oPmQ_aWePMBiF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isConfigured = () => {
  return SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE';
};