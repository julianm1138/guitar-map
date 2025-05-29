import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonkey = import.meta.env.VITE_ANON_PUBLIC_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonkey);
