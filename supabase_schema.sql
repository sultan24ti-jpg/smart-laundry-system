-- ============================================================================
-- Smart Laundry System - Skema Supabase
-- ============================================================================
-- Jalankan file ini di Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Kalau tabel kamu SUDAH ada dengan nama kolom yang BEDA, jangan jalankan ini
-- begitu saja (nanti dobel) -- cukup samakan nama kolom di src/services/database.js
-- dengan kolom yang sudah kamu punya, ATAU drop tabel lama lalu jalankan file ini
-- supaya 100% cocok dengan kode yang sudah disesuaikan.
-- ============================================================================

-- Aktifkan extension untuk generate UUID otomatis (biasanya sudah aktif di Supabase)
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- TABEL: users  (akun login: owner, kasir, pelanggan)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  nama        text not null,
  email       text not null unique,
  password    text not null, -- NOTE: plain text mengikuti struktur database.js asli (lihat catatan keamanan)
  role        text not null default 'pelanggan', -- 'owner' | 'kasir' | 'pelanggan'
  nohp        text default '',
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TABEL: pelanggan
-- ---------------------------------------------------------------------------
create table if not exists public.pelanggan (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid references public.users(id) on delete set null,
  nama              text not null,
  email             text default '',
  nohp              text not null,
  alamat            text default '',
  total_transaksi   integer not null default 0,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TABEL: layanan
-- ---------------------------------------------------------------------------
create table if not exists public.layanan (
  id            uuid primary key default gen_random_uuid(),
  nama          text not null,
  satuan        text not null default 'kg',
  harga         numeric not null default 0,
  durasi_hari   integer not null default 1,
  aktif         boolean not null default true
);

-- ---------------------------------------------------------------------------
-- TABEL: transaksi
-- ---------------------------------------------------------------------------
create table if not exists public.transaksi (
  id                uuid primary key default gen_random_uuid(),
  kode              text not null unique,
  pelanggan_id      uuid references public.pelanggan(id) on delete set null,
  pelanggan_nama    text not null,
  pelanggan_nohp    text not null,
  items             jsonb not null default '[]',
  subtotal          numeric not null default 0,
  total             numeric not null default 0,
  status            text not null default 'diterima', -- diterima|proses|siap_diambil|selesai|batal
  catatan           text default '',
  estimasi_selesai  timestamptz,
  history           jsonb not null default '[]',
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TABEL: pengeluaran
-- ---------------------------------------------------------------------------
create table if not exists public.pengeluaran (
  id            uuid primary key default gen_random_uuid(),
  keterangan    text not null,
  kategori      text not null,
  jumlah        numeric not null default 0,
  tanggal       date not null default current_date,
  created_at    timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- Project ini belum pakai Supabase Auth (login custom ke tabel "users"),
-- jadi semua request ke Supabase jalan pakai "anon key" dari browser.
-- Supaya app bisa baca/tulis, RLS perlu policy permissive untuk role anon.
--
-- !! CATATAN KEAMANAN !!
-- Ini OK untuk belajar/demo, tapi untuk production sebaiknya:
--   1) Pindahkan operasi sensitif (login, create transaksi, dst) ke server/Edge
--      Function yang pakai service_role key, JANGAN expose service_role ke browser.
--   2) Atau migrasi login ke Supabase Auth supaya bisa pakai auth.uid() di policy.
--   3) Jangan simpan password dalam bentuk plain text (pakai hashing, idealnya
--      lewat Supabase Auth bawaan, bukan tabel users manual seperti ini).
-- ============================================================================

alter table public.users        enable row level security;
alter table public.pelanggan    enable row level security;
alter table public.layanan      enable row level security;
alter table public.transaksi    enable row level security;
alter table public.pengeluaran  enable row level security;

drop policy if exists "anon full access" on public.users;
create policy "anon full access" on public.users
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.pelanggan;
create policy "anon full access" on public.pelanggan
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.layanan;
create policy "anon full access" on public.layanan
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.transaksi;
create policy "anon full access" on public.transaksi
  for all using (true) with check (true);

drop policy if exists "anon full access" on public.pengeluaran;
create policy "anon full access" on public.pengeluaran
  for all using (true) with check (true);

-- ============================================================================
-- SEED DATA AWAL (boleh skip baris ini kalau sudah ada datanya sendiri --
-- src/services/database.js juga otomatis seed user & layanan default kalau
-- tabel users/layanan masih kosong saat app pertama kali dibuka)
-- ============================================================================

insert into public.users (nama, email, password, role, nohp)
select 'Admin Owner', 'owner@laundry.com', 'admin123', 'owner', '081234567890'
where not exists (select 1 from public.users where email = 'owner@laundry.com');

insert into public.users (nama, email, password, role, nohp)
select 'Kasir Satu', 'kasir@laundry.com', 'kasir123', 'kasir', '081234567891'
where not exists (select 1 from public.users where email = 'kasir@laundry.com');

insert into public.layanan (nama, satuan, harga, durasi_hari, aktif)
select * from (values
  ('Cuci Setrika Reguler', 'kg', 7000, 2, true),
  ('Cuci Setrika Express', 'kg', 12000, 1, true),
  ('Cuci Kering Saja', 'kg', 5000, 2, true),
  ('Setrika Saja', 'kg', 4000, 1, true),
  ('Cuci Sepatu', 'pasang', 20000, 2, true),
  ('Cuci Bed Cover', 'pcs', 25000, 3, true)
) as v(nama, satuan, harga, durasi_hari, aktif)
where not exists (select 1 from public.layanan);
