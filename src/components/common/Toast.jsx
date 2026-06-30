import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const toast = {
    success: (msg) => push('success', msg),
    error: (msg) => push('error', msg),
    info: (msg) => push('info', msg),
    warning: (msg) => push('warning', msg),
  };

  const icons = {
    success: <FiCheckCircle />,
    error: <FiXCircle />,
    info: <FiInfo />,
    warning: <FiAlertTriangle />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg transition duration-200 ${
              t.type === 'success'
                ? 'border-emerald-200 bg-emerald-500 text-white'
                : t.type === 'error'
                ? 'border-rose-200 bg-rose-500 text-white'
                : t.type === 'warning'
                ? 'border-amber-200 bg-amber-500 text-slate-900'
                : 'border-sky-200 bg-sky-500 text-white'
            }`}
          >
            {icons[t.type]}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast harus dipakai di dalam ToastProvider');
  return ctx;
};

export default ToastProvider;
