// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gnzwdxnsuiszgngqalsj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduendkeG5zdWlzemduZ3FhbHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NjE5NzUsImV4cCI6MjA1NjAzNzk3NX0.9NHxXgSg8jJ9_wbiTZfv4OoMSMc_3NfcwpIAmKNTx4Q";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);