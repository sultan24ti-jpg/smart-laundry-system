import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initial = user?.nama ? user.nama.charAt(0).toUpperCase() : '?';

  return (
    <header className="flex items-center justify-between gap-4 bg-white border-b border-slate-200 px-4 py-3 shadow-sm md:px-8">
      <button
        onClick={onToggleSidebar}
        aria-label="Toggle menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
      >
        <FiMenu />
      </button>

      <div className="flex-1" />

      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-lg font-semibold text-white shadow-sm">
            {initial}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-slate-900">{user.nama}</div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FiLogOut /> Keluar
          </button>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
