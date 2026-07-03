// src/services/database.js
// Versi Supabase. Nama fungsi & bentuk data yang di-return SENGAJA dibuat sama
// persis seperti versi localStorage sebelumnya (field tetap camelCase: nama,
// nohp, durasiHari, pelangganNama, createdAt, dst) supaya komponen lain tidak
// perlu diubah strukturnya. Yang berubah: semua fungsi sekarang ASYNC (pakai
// Promise) karena query ke Supabase berjalan lewat jaringan -> WAJIB dipanggil
// dengan `await` di komponen yang memakainya.
//
// Skema tabel yang diasumsikan (snake_case, standar Postgres) ada di file
// supabase_schema.sql. Kalau struktur tabel kamu di Supabase berbeda, sesuaikan
// nama kolom di bagian "MAPPING" di bawah ini.

import { supabase } from './supabaseClient';

const SESSION_KEY = 'sls_session';

const check = (error) => {
  if (error) throw new Error(error.message || 'Terjadi kesalahan pada database');
};

// ================= MAPPING: row (snake_case, dari Supabase) <-> objek app (camelCase) =================

const mapUser = (row) =>
  !row
    ? null
    : {
        id: row.id,
        nama: row.nama,
        email: row.email,
        password: row.password,
        role: row.role,
        nohp: row.nohp || '',
        createdAt: row.created_at,
      };

const mapPelanggan = (row) =>
  !row
    ? null
    : {
        id: row.id,
        userId: row.user_id,
        nama: row.nama,
        email: row.email || '',
        nohp: row.nohp,
        alamat: row.alamat || '',
        totalTransaksi: row.total_transaksi || 0,
        createdAt: row.created_at,
      };

const mapLayanan = (row) =>
  !row
    ? null
    : {
        id: row.id,
        nama: row.nama,
        satuan: row.satuan,
        harga: row.harga,
        durasiHari: row.durasi_hari,
        aktif: row.aktif,
      };

const layananToRow = (data) => ({
  ...(data.nama !== undefined && { nama: data.nama }),
  ...(data.satuan !== undefined && { satuan: data.satuan }),
  ...(data.harga !== undefined && { harga: data.harga }),
  ...(data.durasiHari !== undefined && { durasi_hari: data.durasiHari }),
  ...(data.aktif !== undefined && { aktif: data.aktif }),
});

const mapTransaksi = (row) =>
  !row
    ? null
    : {
        id: row.id,
        kode: row.kode,
        pelangganId: row.pelanggan_id,
        pelangganNama: row.pelanggan_nama,
        pelangganNohp: row.pelanggan_nohp,
        items: row.items || [],
        subtotal: row.subtotal,
        total: row.total,
        status: row.status,
        catatan: row.catatan || '',
        estimasiSelesai: row.estimasi_selesai,
        history: row.history || [],
        createdAt: row.created_at,
      };

const mapPengeluaran = (row) =>
  !row
    ? null
    : {
        id: row.id,
        keterangan: row.keterangan,
        kategori: row.kategori,
        jumlah: row.jumlah,
        tanggal: row.tanggal,
        createdAt: row.created_at,
      };

// ---------------- SEED DATA ----------------
// Cuma mengisi data default kalau tabel users / layanan masih kosong, supaya
// aman dipanggil berkali-kali (idempotent) dan tidak menimpa data yang sudah ada.
export const seedDatabase = async () => {
  const { count: userCount, error: userErr } = await supabase
    .from('users')
    .select('id', { count: 'exact', head: true });
  check(userErr);

  if (!userCount) {
    const { error } = await supabase.from('users').insert([
      { nama: 'Admin Owner', email: 'owner@laundry.com', password: 'admin123', role: 'owner', nohp: '081234567890' },
      { nama: 'Kasir Satu', email: 'kasir@laundry.com', password: 'kasir123', role: 'kasir', nohp: '081234567891' },
    ]);
    check(error);
  }

  const { count: layananCount, error: layananErr } = await supabase
    .from('layanan')
    .select('id', { count: 'exact', head: true });
  check(layananErr);

  if (!layananCount) {
    const { error } = await supabase.from('layanan').insert([
      { nama: 'Cuci Setrika Reguler', satuan: 'kg', harga: 7000, durasi_hari: 2, aktif: true },
      { nama: 'Cuci Setrika Express', satuan: 'kg', harga: 12000, durasi_hari: 1, aktif: true },
      { nama: 'Cuci Kering Saja', satuan: 'kg', harga: 5000, durasi_hari: 2, aktif: true },
      { nama: 'Setrika Saja', satuan: 'kg', harga: 4000, durasi_hari: 1, aktif: true },
      { nama: 'Cuci Sepatu', satuan: 'pasang', harga: 20000, durasi_hari: 2, aktif: true },
      { nama: 'Cuci Bed Cover', satuan: 'pcs', harga: 25000, durasi_hari: 3, aktif: true },
    ]);
    check(error);
  }
};

// ---------------- AUTH ----------------
// NOTE: ini login custom ke tabel "users" (bukan Supabase Auth), mengikuti
// struktur database.js asli. Password disimpan plain text -- cocok untuk
// belajar/demo, TIDAK disarankan untuk production sungguhan.
export const registerUser = async ({ nama, email, password, nohp }) => {
  const { data: existing, error: checkErr } = await supabase
    .from('users')
    .select('id')
    .ilike('email', email)
    .maybeSingle();
  check(checkErr);
  if (existing) return { success: false, error: 'Email sudah terdaftar' };

  const { data: inserted, error: insertErr } = await supabase
    .from('users')
    .insert({ nama, email, password, nohp: nohp || '', role: 'pelanggan' })
    .select()
    .single();
  check(insertErr);

  const newUser = mapUser(inserted);

  // Otomatis daftar sebagai pelanggan juga
  const { error: plgErr } = await supabase.from('pelanggan').insert({
    user_id: newUser.id,
    nama,
    email,
    nohp: nohp || '',
    alamat: '',
    total_transaksi: 0,
  });
  check(plgErr);

  return { success: true, user: newUser };
};

export const loginUser = async ({ email, password }) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('email', email)
    .maybeSingle();
  check(error);

  if (!data) return { success: false, error: 'Email tidak ditemukan' };
  if (data.password !== password) return { success: false, error: 'Password salah' };

  const session = { id: data.id, nama: data.nama, email: data.email, role: data.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: session };
};

export const logoutUser = () => localStorage.removeItem(SESSION_KEY);

export const getCurrentSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ---------------- LAYANAN ----------------
export const getAllLayanan = async () => {
  const { data, error } = await supabase.from('layanan').select('*').order('nama', { ascending: true });
  check(error);
  return (data || []).map(mapLayanan);
};

export const getLayananAktif = async () => {
  const { data, error } = await supabase
    .from('layanan')
    .select('*')
    .eq('aktif', true)
    .order('nama', { ascending: true });
  check(error);
  return (data || []).map(mapLayanan);
};

export const createLayanan = async (data) => {
  const { data: inserted, error } = await supabase
    .from('layanan')
    .insert({ ...layananToRow(data), aktif: data.aktif ?? true })
    .select()
    .single();
  check(error);
  return mapLayanan(inserted);
};

export const updateLayanan = async (id, data) => {
  const { error } = await supabase.from('layanan').update(layananToRow(data)).eq('id', id);
  check(error);
};

export const deleteLayanan = async (id) => {
  const { error } = await supabase.from('layanan').delete().eq('id', id);
  check(error);
};

// ---------------- PELANGGAN ----------------
export const getAllPelanggan = async () => {
  const { data, error } = await supabase
    .from('pelanggan')
    .select('*')
    .order('created_at', { ascending: false });
  check(error);
  return (data || []).map(mapPelanggan);
};

export const findOrCreatePelangganByPhone = async ({ nama, nohp, alamat }) => {
  const { data: existing, error: findErr } = await supabase
    .from('pelanggan')
    .select('*')
    .eq('nohp', nohp)
    .maybeSingle();
  check(findErr);
  if (existing) return mapPelanggan(existing);

  const { data: inserted, error: insertErr } = await supabase
    .from('pelanggan')
    .insert({ user_id: null, nama, email: '', nohp, alamat: alamat || '', total_transaksi: 0 })
    .select()
    .single();
  check(insertErr);
  return mapPelanggan(inserted);
};

export const incrementPelangganTransaksi = async (pelangganId) => {
  const { data: current, error: getErr } = await supabase
    .from('pelanggan')
    .select('total_transaksi')
    .eq('id', pelangganId)
    .single();
  check(getErr);

  const { error: updateErr } = await supabase
    .from('pelanggan')
    .update({ total_transaksi: (current?.total_transaksi || 0) + 1 })
    .eq('id', pelangganId);
  check(updateErr);
};

export const deletePelanggan = async (id) => {
  const { error } = await supabase.from('pelanggan').delete().eq('id', id);
  check(error);
};

// ---------------- TRANSAKSI ----------------
const STATUS_FLOW = ['diterima', 'proses', 'siap_diambil', 'selesai'];
export const STATUS_LABELS = {
  diterima: 'Diterima',
  proses: 'Sedang Dicuci',
  siap_diambil: 'Siap Diambil',
  selesai: 'Selesai',
  batal: 'Dibatalkan',
};

export const getAllTransaksi = async () => {
  const { data, error } = await supabase
    .from('transaksi')
    .select('*')
    .order('created_at', { ascending: false });
  check(error);
  return (data || []).map(mapTransaksi);
};

export const getTransaksiById = async (id) => {
  const { data, error } = await supabase.from('transaksi').select('*').eq('id', id).maybeSingle();
  check(error);
  return mapTransaksi(data);
};

export const getTransaksiByPelangganId = async (pelangganId) => {
  const { data, error } = await supabase
    .from('transaksi')
    .select('*')
    .eq('pelanggan_id', pelangganId)
    .order('created_at', { ascending: false });
  check(error);
  return (data || []).map(mapTransaksi);
};

export const getTransaksiByKode = async (kode) => {
  const { data, error } = await supabase
    .from('transaksi')
    .select('*')
    .ilike('kode', kode)
    .maybeSingle();
  check(error);
  return mapTransaksi(data);
};

const generateKode = async () => {
  const today = new Date();
  const ymd = today.toISOString().slice(0, 10).replace(/-/g, '');
  const { count, error } = await supabase
    .from('transaksi')
    .select('id', { count: 'exact', head: true })
    .ilike('kode', `LDY-${ymd}%`);
  check(error);
  return `LDY-${ymd}-${String((count || 0) + 1).padStart(3, '0')}`;
};

export const createTransaksi = async ({ pelanggan, items, catatan }) => {
  const pelangganData = await findOrCreatePelangganByPhone(pelanggan);
  const subtotal = items.reduce((sum, it) => sum + it.qty * it.harga, 0);

  const layananList = await getAllLayanan();
  const durasiMax = Math.max(
    ...items.map((it) => {
      const lyn = layananList.find((l) => l.id === it.layananId);
      return lyn ? lyn.durasiHari : 1;
    }),
    1
  );
  const estimasi = new Date();
  estimasi.setDate(estimasi.getDate() + durasiMax);

  const kode = await generateKode();

  const { data: inserted, error } = await supabase
    .from('transaksi')
    .insert({
      kode,
      pelanggan_id: pelangganData.id,
      pelanggan_nama: pelangganData.nama,
      pelanggan_nohp: pelangganData.nohp,
      items,
      subtotal,
      total: subtotal,
      status: 'diterima',
      catatan: catatan || '',
      estimasi_selesai: estimasi.toISOString(),
      history: [{ status: 'diterima', at: new Date().toISOString(), note: 'Transaksi dibuat' }],
    })
    .select()
    .single();
  check(error);

  await incrementPelangganTransaksi(pelangganData.id);

  return mapTransaksi(inserted);
};

export const updateTransaksiStatus = async (id, status, note) => {
  const { data: current, error: getErr } = await supabase
    .from('transaksi')
    .select('history')
    .eq('id', id)
    .single();
  check(getErr);

  const newHistory = [...(current?.history || []), { status, at: new Date().toISOString(), note: note || '' }];

  const { error: updateErr } = await supabase
    .from('transaksi')
    .update({ status, history: newHistory })
    .eq('id', id);
  check(updateErr);
};

export const getNextStatus = (current) => {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
};

export const deleteTransaksi = async (id) => {
  const { error } = await supabase.from('transaksi').delete().eq('id', id);
  check(error);
};

// ---------------- PENGELUARAN ----------------
export const getAllPengeluaran = async () => {
  const { data, error } = await supabase
    .from('pengeluaran')
    .select('*')
    .order('tanggal', { ascending: false });
  check(error);
  return (data || []).map(mapPengeluaran);
};

export const createPengeluaran = async (data) => {
  const { data: inserted, error } = await supabase
    .from('pengeluaran')
    .insert({
      keterangan: data.keterangan,
      kategori: data.kategori,
      jumlah: Number(data.jumlah),
      tanggal: data.tanggal,
    })
    .select()
    .single();
  check(error);
  return mapPengeluaran(inserted);
};

export const deletePengeluaran = async (id) => {
  const { error } = await supabase.from('pengeluaran').delete().eq('id', id);
  check(error);
};

// ---------------- LAPORAN / DASHBOARD ----------------
const isSameDay = (d1, d2) => new Date(d1).toDateString() === new Date(d2).toDateString();
const isSameMonth = (d1, d2) =>
  new Date(d1).getMonth() === new Date(d2).getMonth() &&
  new Date(d1).getFullYear() === new Date(d2).getFullYear();

export const getDashboardStats = async () => {
  const [transaksi, pelanggan] = await Promise.all([getAllTransaksi(), getAllPelanggan()]);
  const now = new Date();

  const transaksiHariIni = transaksi.filter((t) => isSameDay(t.createdAt, now)).length;
  const pendapatanHariIni = transaksi
    .filter((t) => isSameDay(t.createdAt, now) && t.status !== 'batal')
    .reduce((sum, t) => sum + t.total, 0);
  const pendapatanBulanIni = transaksi
    .filter((t) => isSameMonth(t.createdAt, now) && t.status !== 'batal')
    .reduce((sum, t) => sum + t.total, 0);

  const statusCount = STATUS_FLOW.reduce((acc, s) => {
    acc[s] = transaksi.filter((t) => t.status === s).length;
    return acc;
  }, {});

  return {
    totalPelanggan: pelanggan.length,
    transaksiHariIni,
    pendapatanHariIni,
    pendapatanBulanIni,
    statusCount,
    transaksiTerbaru: transaksi.slice(0, 5), // sudah terurut terbaru dulu dari query
  };
};

export const getLaporanKeuangan = async ({ bulan, tahun }) => {
  const start = new Date(Number(tahun), Number(bulan) - 1, 1);
  const end = new Date(Number(tahun), Number(bulan), 1);

  const { data: transaksiRows, error: trxErr } = await supabase
    .from('transaksi')
    .select('*')
    .neq('status', 'batal')
    .gte('created_at', start.toISOString())
    .lt('created_at', end.toISOString());
  check(trxErr);

  const { data: pengeluaranRows, error: expErr } = await supabase
    .from('pengeluaran')
    .select('*')
    .gte('tanggal', start.toISOString().slice(0, 10))
    .lt('tanggal', end.toISOString().slice(0, 10));
  check(expErr);

  const transaksi = (transaksiRows || []).map(mapTransaksi);
  const pengeluaran = (pengeluaranRows || []).map(mapPengeluaran);

  const totalPemasukan = transaksi.reduce((sum, t) => sum + t.total, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, p) => sum + Number(p.jumlah), 0);

  return {
    transaksi,
    pengeluaran,
    totalPemasukan,
    totalPengeluaran,
    labaBersih: totalPemasukan - totalPengeluaran,
  };
};

export default {
  seedDatabase,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentSession,
  getAllLayanan,
  getLayananAktif,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  getAllPelanggan,
  deletePelanggan,
  getAllTransaksi,
  getTransaksiById,
  getTransaksiByPelangganId,
  getTransaksiByKode,
  createTransaksi,
  updateTransaksiStatus,
  getNextStatus,
  deleteTransaksi,
  getAllPengeluaran,
  createPengeluaran,
  deletePengeluaran,
  getDashboardStats,
  getLaporanKeuangan,
  STATUS_LABELS,
};
