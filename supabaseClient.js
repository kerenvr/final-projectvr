import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,  // Access the environment variables using import.meta.env
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default supabase;
