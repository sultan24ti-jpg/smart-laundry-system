-- ============================================================================
-- Smart Laundry System - Seed Data Lengkap (semua tabel)
-- ============================================================================
-- Jalankan SETELAH supabase_schema.sql (tabel + RLS harus sudah ada).
--
-- !! PERINGATAN !!
-- Script ini diawali dengan TRUNCATE, artinya SEMUA data yang sudah ada di
-- 5 tabel ini akan DIHAPUS dulu sebelum diisi ulang dengan data contoh di
-- bawah. Cocok dipakai pas masih tahap development/testing. Kalau sudah ada
-- data asli yang mau dipertahankan, JANGAN jalankan script ini -- atau hapus
-- dulu bagian TRUNCATE-nya dan sesuaikan sendiri bagian insert-nya.
-- ============================================================================

create extension if not exists pgcrypto;

truncate table
  public.transaksi,
  public.pengeluaran,
  public.pelanggan,
  public.layanan,
  public.users
restart identity cascade;

-- ---------------------------------------------------------------------------
-- USERS (akun login)
-- ---------------------------------------------------------------------------
insert into public.users (id, nama, email, password, role, nohp, created_at) values
  ('30000000-0000-0000-0000-000000000001', 'Admin Owner',  'owner@laundry.com', 'admin123', 'owner',     '081234567890', now() - interval '60 days'),
  ('30000000-0000-0000-0000-000000000002', 'Kasir Satu',   'kasir@laundry.com', 'kasir123', 'kasir',     '081234567891', now() - interval '45 days'),
  ('30000000-0000-0000-0000-000000000003', 'Budi Santoso', 'budi@gmail.com',    'budi123',  'pelanggan', '081234500001', now() - interval '20 days');

-- ---------------------------------------------------------------------------
-- LAYANAN
-- ---------------------------------------------------------------------------
insert into public.layanan (id, nama, satuan, harga, durasi_hari, aktif) values
  ('10000000-0000-0000-0000-000000000001', 'Cuci Setrika Reguler', 'kg',      7000,  2, true),
  ('10000000-0000-0000-0000-000000000002', 'Cuci Setrika Express', 'kg',      12000, 1, true),
  ('10000000-0000-0000-0000-000000000003', 'Cuci Kering Saja',     'kg',      5000,  2, true),
  ('10000000-0000-0000-0000-000000000004', 'Setrika Saja',         'kg',      4000,  1, true),
  ('10000000-0000-0000-0000-000000000005', 'Cuci Sepatu',          'pasang',  20000, 2, true),
  ('10000000-0000-0000-0000-000000000006', 'Cuci Bed Cover',       'pcs',     25000, 3, true);

-- ---------------------------------------------------------------------------
-- PELANGGAN
-- ---------------------------------------------------------------------------
insert into public.pelanggan (id, user_id, nama, email, nohp, alamat, total_transaksi, created_at) values
  ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Budi Santoso', 'budi@gmail.com', '081234500001', 'Jl. Mawar No. 1, Pekanbaru',   2, now() - interval '20 days'),
  ('20000000-0000-0000-0000-000000000002', null, 'Siti Aminah',  '', '081234500002', 'Jl. Melati No. 5, Pekanbaru',   1, now() - interval '15 days'),
  ('20000000-0000-0000-0000-000000000003', null, 'Andi Wijaya',  '', '081234500003', 'Jl. Kenanga No. 3, Pekanbaru',  1, now() - interval '10 days'),
  ('20000000-0000-0000-0000-000000000004', null, 'Dewi Lestari', '', '081234500004', 'Jl. Anggrek No. 8, Pekanbaru',  1, now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000005', null, 'Rudi Hartono', '', '081234500005', 'Jl. Dahlia No. 2, Pekanbaru',   1, now() - interval '18 days');

-- ---------------------------------------------------------------------------
-- TRANSAKSI
-- (items & history disusun seperti yang dibentuk createTransaksi/updateTransaksiStatus di app)
-- ---------------------------------------------------------------------------

-- t1: Budi - selesai
insert into public.transaksi (id, kode, pelanggan_id, pelanggan_nama, pelanggan_nohp, items, subtotal, total, status, catatan, estimasi_selesai, history, created_at) values (
  '40000000-0000-0000-0000-000000000001',
  'LDY-20260620-001',
  '20000000-0000-0000-0000-000000000001', 'Budi Santoso', '081234500001',
  '[{"layananId":"10000000-0000-0000-0000-000000000001","namaLayanan":"Cuci Setrika Reguler","satuan":"kg","qty":5,"harga":7000,"subtotal":35000}]',
  35000, 35000, 'selesai', '',
  (now() - interval '20 days') + interval '2 days',
  '[{"status":"diterima","at":"2026-06-20T08:00:00+07:00","note":"Transaksi dibuat"},{"status":"proses","at":"2026-06-20T13:00:00+07:00","note":""},{"status":"siap_diambil","at":"2026-06-21T10:00:00+07:00","note":""},{"status":"selesai","at":"2026-06-22T09:00:00+07:00","note":"Sudah diambil pelanggan"}]',
  now() - interval '20 days'
);

-- t2: Siti - proses
insert into public.transaksi (id, kode, pelanggan_id, pelanggan_nama, pelanggan_nohp, items, subtotal, total, status, catatan, estimasi_selesai, history, created_at) values (
  '40000000-0000-0000-0000-000000000002',
  'LDY-20260622-001',
  '20000000-0000-0000-0000-000000000002', 'Siti Aminah', '081234500002',
  '[{"layananId":"10000000-0000-0000-0000-000000000002","namaLayanan":"Cuci Setrika Express","satuan":"kg","qty":3,"harga":12000,"subtotal":36000},{"layananId":"10000000-0000-0000-0000-000000000005","namaLayanan":"Cuci Sepatu","satuan":"pasang","qty":2,"harga":20000,"subtotal":40000}]',
  76000, 76000, 'proses', 'Sepatu putih, tolong jangan disikat kasar',
  (now() - interval '15 days') + interval '2 days',
  '[{"status":"diterima","at":"2026-06-22T09:30:00+07:00","note":"Transaksi dibuat"},{"status":"proses","at":"2026-06-23T08:00:00+07:00","note":""}]',
  now() - interval '15 days'
);

-- t3: Andi - siap diambil
insert into public.transaksi (id, kode, pelanggan_id, pelanggan_nama, pelanggan_nohp, items, subtotal, total, status, catatan, estimasi_selesai, history, created_at) values (
  '40000000-0000-0000-0000-000000000003',
  'LDY-20260625-001',
  '20000000-0000-0000-0000-000000000003', 'Andi Wijaya', '081234500003',
  '[{"layananId":"10000000-0000-0000-0000-000000000004","namaLayanan":"Setrika Saja","satuan":"kg","qty":4,"harga":4000,"subtotal":16000}]',
  16000, 16000, 'siap_diambil', '',
  (now() - interval '10 days') + interval '1 days',
  '[{"status":"diterima","at":"2026-06-25T10:15:00+07:00","note":"Transaksi dibuat"},{"status":"proses","at":"2026-06-25T15:00:00+07:00","note":""},{"status":"siap_diambil","at":"2026-06-26T09:00:00+07:00","note":"Siap diambil di kasir"}]',
  now() - interval '10 days'
);

-- t4: Budi - diterima (baru masuk)
insert into public.transaksi (id, kode, pelanggan_id, pelanggan_nama, pelanggan_nohp, items, subtotal, total, status, catatan, estimasi_selesai, history, created_at) values (
  '40000000-0000-0000-0000-000000000004',
  'LDY-20260628-001',
  '20000000-0000-0000-0000-000000000001', 'Budi Santoso', '081234500001',
  '[{"layananId":"10000000-0000-0000-0000-000000000003","namaLayanan":"Cuci Kering Saja","satuan":"kg","qty":6,"harga":5000,"subtotal":30000}]',
  30000, 30000, 'diterima', '',
  (now() - interval '2 days') + interval '2 days',
  '[{"status":"diterima","at":"2026-06-28T11:00:00+07:00","note":"Transaksi dibuat"}]',
  now() - interval '2 days'
);

-- t5: Dewi - diterima (hari ini)
insert into public.transaksi (id, kode, pelanggan_id, pelanggan_nama, pelanggan_nohp, items, subtotal, total, status, catatan, estimasi_selesai, history, created_at) values (
  '40000000-0000-0000-0000-000000000005',
  'LDY-20260630-001',
  '20000000-0000-0000-0000-000000000004', 'Dewi Lestari', '081234500004',
  '[{"layananId":"10000000-0000-0000-0000-000000000006","namaLayanan":"Cuci Bed Cover","satuan":"pcs","qty":2,"harga":25000,"subtotal":50000}]',
  50000, 50000, 'diterima', 'Bed cover motif bunga, ada noda kopi',
  now() + interval '3 days',
  ('[{"status":"diterima","at":"' || to_char(now(), 'YYYY-MM-DD"T"HH24:MI:SS') || '+07:00","note":"Transaksi dibuat"}]')::jsonb,
  now()
);

-- t6: Rudi - dibatalkan
insert into public.transaksi (id, kode, pelanggan_id, pelanggan_nama, pelanggan_nohp, items, subtotal, total, status, catatan, estimasi_selesai, history, created_at) values (
  '40000000-0000-0000-0000-000000000006',
  'LDY-20260615-001',
  '20000000-0000-0000-0000-000000000005', 'Rudi Hartono', '081234500005',
  '[{"layananId":"10000000-0000-0000-0000-000000000001","namaLayanan":"Cuci Setrika Reguler","satuan":"kg","qty":3,"harga":7000,"subtotal":21000}]',
  21000, 21000, 'batal', 'Pelanggan batal, cucian diambil sendiri',
  (now() - interval '18 days') + interval '2 days',
  '[{"status":"diterima","at":"2026-06-15T09:00:00+07:00","note":"Transaksi dibuat"},{"status":"batal","at":"2026-06-16T10:00:00+07:00","note":"Dibatalkan oleh pelanggan"}]',
  now() - interval '18 days'
);

-- ---------------------------------------------------------------------------
-- PENGELUARAN
-- ---------------------------------------------------------------------------
insert into public.pengeluaran (keterangan, kategori, jumlah, tanggal, created_at) values
  ('Tagihan listrik bulan Juni', 'Listrik',              850000,  '2026-06-05', now() - interval '25 days'),
  ('Tagihan air bulan Juni',     'Air',                  250000,  '2026-06-05', now() - interval '25 days'),
  ('Beli detergen & pewangi',    'Sabun & Bahan Cuci',   600000,  '2026-06-10', now() - interval '20 days'),
  ('Servis mesin cuci',          'Perawatan Mesin',      450000,  '2026-06-18', now() - interval '12 days'),
  ('Gaji karyawan Juni',         'Gaji Karyawan',        3000000, '2026-06-25', now() - interval '5 days');
