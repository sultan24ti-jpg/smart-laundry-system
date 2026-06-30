import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiPlusCircle,
  FiList,
  FiPackage,
  FiSearch,
  FiDollarSign,
  FiTrendingDown,
  FiUsers,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen }) => {
  const { user } = useAuth();
  const isOwnerOrKasir = user && ['owner', 'kasir'].includes(user.role);

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-950 text-slate-100 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col border-r border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-5 py-6 shadow-xl md:shadow-none">
        <div className="mb-8 flex items-center gap-3 text-lg font-semibold text-white">
          <span>🧺</span>
          <span>Smart Laundry</span>
        </div>

        <nav className="space-y-6 overflow-y-auto pr-1">
          {isOwnerOrKasir && (
            <>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Menu Utama</div>
              <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiGrid /> Dashboard
              </NavLink>

              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Transaksi</div>
              <NavLink to="/transaksi/baru" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiPlusCircle /> Transaksi Baru
              </NavLink>
              <NavLink to="/transaksi" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiList /> Daftar Transaksi
              </NavLink>

              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Layanan</div>
              <NavLink to="/layanan" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiPackage /> Kelola Layanan
              </NavLink>

              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Pelanggan</div>
              <NavLink to="/pelanggan" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiUsers /> Daftar Pelanggan
              </NavLink>

              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Keuangan</div>
              <NavLink to="/keuangan/laporan" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiDollarSign /> Laporan Keuangan
              </NavLink>
              <NavLink to="/keuangan/pengeluaran" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <FiTrendingDown /> Kelola Pengeluaran
              </NavLink>
            </>
          )}

          <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Lacak Cucian</div>
          <NavLink to="/cek-status" className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
            <FiSearch /> Cek Status
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
