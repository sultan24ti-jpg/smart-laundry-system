import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ToastProvider } from './components/common/Toast';
import { useAuth } from './context/AuthContext';

import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardOwner from './components/dashboard/DashboardOwner';
import TransaksiBaru from './components/transaksi/TransaksiBaru';
import DaftarTransaksi from './components/transaksi/DaftarTransaksi';
import UpdateStatus from './components/transaksi/UpdateStatus';
import DaftarLayanan from './components/layanan/DaftarLayanan';
import KelolaLayanan from './components/layanan/KelolaLayanan';
import CekStatus from './components/tracking/CekStatus';
import LaporanKeuangan from './components/keuangan/LaporanKeuangan';
import KelolaPengeluaran from './components/keuangan/KelolaPengeluaran';
import DaftarPelanggan from './components/pelanggan/DaftarPelanggan';

const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const isOwnerOrKasir = user && ['owner', 'kasir'].includes(user.role);

  // Pelanggan tidak butuh sidebar sama sekali — layout jadi navbar atas full width,
  // supaya lebih mirip landing page Chingu Laundry ketimbang panel admin.
  if (!isOwnerOrKasir) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-6xl p-6 md:p-8">{children}</main>
        <footer className="site-footer">
          <div className="footer-glow w-72 h-72 bg-sky-500/30 -top-20 -left-10" />
          <div className="footer-glow w-72 h-72 bg-pink-500/25 -bottom-24 right-0" />
          <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-8">
            <footer className="footer">
              <aside>
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500 text-lg ring-1 ring-white/20">🧺</span>
                  <span className="text-lg font-extrabold font-display bg-gradient-to-r from-sky-300 via-indigo-200 to-pink-300 bg-clip-text text-transparent">Smart Laundry</span>
                </div>
                <p className="text-sm text-slate-300/80 leading-relaxed max-w-xs">
                  Laundry bersih, wangi, higienis, dan tepat waktu. Kami bantu urus cucianmu, kamu fokus ke hal yang lebih penting.
                </p>
              </aside>
              <nav>
                <h6 className="footer-title text-pink-300 opacity-100">Layanan</h6>
                <span className="text-sm text-slate-300/80">Cuci Kiloan &amp; Satuan</span>
                <span className="text-sm text-slate-300/80">Cuci Sepatu</span>
                <span className="text-sm text-slate-300/80">Cuci Bed Cover</span>
                <span className="text-sm text-slate-300/80">Setrika Express &amp; Reguler</span>
              </nav>
              <nav>
                <h6 className="footer-title text-pink-300 opacity-100">Kontak</h6>
                <span className="text-sm text-slate-300/80">Buka setiap hari, 08.00 – 20.00</span>
                <span className="text-sm text-slate-300/80">Lacak status cucian kapan saja via kode nota</span>
              </nav>
            </footer>
            <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Smart Laundry System. Dibuat dengan 💙 &amp; 💗.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 md:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <p className="text-muted">Memuat aplikasi...</p>
      </div>
    );
  }

  const defaultRedirect = user ? (user.role === 'pelanggan' ? '/cek-status' : '/dashboard') : '/login';

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={defaultRedirect} /> : <LoginForm />} />
      <Route path="/register" element={user ? <Navigate to={defaultRedirect} /> : <RegisterForm />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['owner', 'kasir']}>
            <AppShell><DashboardOwner /></AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transaksi/baru"
        element={
          <ProtectedRoute roles={['owner', 'kasir']}>
            <AppShell><TransaksiBaru /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaksi"
        element={
          <ProtectedRoute roles={['owner', 'kasir']}>
            <AppShell><DaftarTransaksi /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaksi/:id/status"
        element={
          <ProtectedRoute roles={['owner', 'kasir']}>
            <AppShell><UpdateStatus /></AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/layanan"
        element={
          <ProtectedRoute roles={['owner', 'kasir']}>
            <AppShell><KelolaLayanan /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/layanan/publik"
        element={<AppShell><DaftarLayanan /></AppShell>}
      />

      <Route
        path="/pelanggan"
        element={
          <ProtectedRoute roles={['owner', 'kasir']}>
            <AppShell><DaftarPelanggan /></AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/keuangan/laporan"
        element={
          <ProtectedRoute roles={['owner']}>
            <AppShell><LaporanKeuangan /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/keuangan/pengeluaran"
        element={
          <ProtectedRoute roles={['owner']}>
            <AppShell><KelolaPengeluaran /></AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/cek-status"
        element={
          <ProtectedRoute>
            <AppShell><CekStatus /></AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={defaultRedirect} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <ToastProvider>
    <AppRoutes />
  </ToastProvider>
);

export default App;
