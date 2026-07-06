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
    <header className="navbar-glass navbar px-4 md:px-8 min-h-0 py-3">
      <div className="navbar-start">
        {onToggleSidebar ? (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
            className="btn btn-circle btn-ghost bg-white/70 border border-white/70 shadow-sm backdrop-blur-md md:hidden"
          >
            <FiMenu />
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500 text-lg shadow-lg shadow-indigo-300/50 ring-1 ring-white/60">
              🧺
            </span>
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-sky-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent font-display">
              Smart Laundry
            </span>
          </div>
        )}
      </div>

      <div className="navbar-center hidden" />

      <div className="navbar-end">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="w-11 rounded-full bg-gradient-to-br from-sky-500 to-pink-500 text-white ring-2 ring-white/70 shadow-lg shadow-pink-300/40">
                <span className="text-lg font-semibold">{initial}</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-bold text-slate-800">{user.nama}</div>
              <div className="badge badge-secondary badge-outline badge-sm font-bold uppercase tracking-wider">{user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              title="Keluar"
              className="btn btn-sm rounded-full border border-white/70 bg-white/70 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white hover:text-pink-600 normal-case font-bold"
            >
              <FiLogOut /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
