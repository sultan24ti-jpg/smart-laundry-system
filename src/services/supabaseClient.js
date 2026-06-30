// src/services/supabaseClient.js
// Inisialisasi client Supabase. URL & anon key diambil dari environment variable
// (lihat file .env.example -> copy jadi .env lalu isi sesuai project Supabase kamu).
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase] VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diset. ' +
      'Buat file .env di root project (copy dari .env.example) lalu isi dengan ' +
      'URL & anon key project Supabase kamu, kemudian restart "npm run dev".'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
