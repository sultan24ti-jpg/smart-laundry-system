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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-6xl p-6 md:p-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
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
