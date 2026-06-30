// src/utils/helpers.js

export const formatCurrency = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
    value || 0
  );

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

export const getStatusBadgeClass = (status) => {
  const map = {
    diterima: 'badge-pending',
    proses: 'badge-process',
    siap_diambil: 'badge-ready',
    selesai: 'badge-done',
    batal: 'badge-cancel',
  };
  return `badge ${map[status] || 'badge-pending'}`;
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePhone = (phone) => /^0[0-9]{9,13}$/.test(phone);
