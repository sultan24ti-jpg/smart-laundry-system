# Smart Laundry System

Implementasi lengkap **Smart Laundry System** menggunakan React + React Router, dengan
penyimpanan data menggunakan `localStorage` (simulasi flat-file database).

## Cara Menjalankan

```bash
npm install
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` (dijalankan dengan Vite).

## Akun Demo

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Owner | owner@laundry.com  | admin123  |
| Kasir | kasir@laundry.com  | kasir123  |

Pelanggan baru bisa daftar sendiri lewat halaman **Register**.

## Fitur

- **Autentikasi**: Login & Register (role: owner, kasir, pelanggan)
- **Dashboard**: ringkasan transaksi, pendapatan harian/bulanan, status cucian
- **Transaksi**: buat transaksi baru, daftar transaksi (cari & filter), update status
- **Layanan**: kelola layanan (CRUD, harga, durasi, aktif/nonaktif)
- **Pelanggan**: daftar pelanggan otomatis terbentuk dari transaksi
- **Keuangan**: laporan keuangan per bulan, kelola pengeluaran
- **Tracking**: cek status cucian publik berdasarkan kode transaksi

## Struktur Proyek

```
smart-laundry-system/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common/      (Navbar, Sidebar, ProtectedRoute, Toast)
│   │   ├── auth/        (LoginForm, RegisterForm)
│   │   ├── dashboard/   (DashboardOwner)
│   │   ├── transaksi/   (TransaksiBaru, DaftarTransaksi, UpdateStatus)
│   │   ├── layanan/     (DaftarLayanan, KelolaLayanan)
│   │   ├── tracking/    (CekStatus)
│   │   ├── keuangan/    (LaporanKeuangan, KelolaPengeluaran)
│   │   └── pelanggan/   (DaftarPelanggan)
│   ├── context/         (AuthContext)
│   ├── services/        (database.js — localStorage data layer)
│   ├── utils/           (helpers.js)
│   ├── styles/          (index.css)
│   ├── App.jsx
│   └── index.jsx
└── package.json
```

## Catatan

- Data tersimpan di `localStorage` browser, jadi data akan tetap ada selama
  browser/profile yang sama dipakai (tidak hilang saat refresh).
- Untuk reset data, jalankan `localStorage.clear()` di console browser, lalu refresh.
