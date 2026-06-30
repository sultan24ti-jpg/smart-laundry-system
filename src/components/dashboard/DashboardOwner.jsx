import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, STATUS_LABELS } from '../../services/database';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../../utils/helpers';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiLoader,
  FiPlus,
  FiArrowDownRight
} from 'react-icons/fi';

const DashboardOwner = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStats();
      // Mengasumsikan `getDashboardStats()` mengembalikan atau kita mock data grafik jika belum ada dari backend
      setStats(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <FiLoader className="spin" size={40} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: 'var(--gray-500)', fontWeight: 500 }}>Memuat data analitik...</p>
        </div>
      </div>
    );
  }

  // Warna untuk status laundry
  const statusColors = {
    diterima: '#F59E0B',    // Amber
    proses: '#3B82F6',      // Blue
    siap_diambil: '#10B981',// Green
    selesai: '#EF4444',     // Red
  };

  // Warna untuk grafik Pie Chart Pengeluaran
  const PIE_COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Data Mock/Tambahan untuk Grafik Keuangan jika backend belum menyediakan secara penuh
  const trenKeuanganData = stats.trenKeuangan || [
    { bulan: 'Jan', pendapatan: 4000000, pengeluaran: 2400000 },
    { bulan: 'Feb', pendapatan: 5000000, pengeluaran: 2800000 },
    { bulan: 'Mar', pendapatan: 4800000, pengeluaran: 2200000 },
    { bulan: 'Apr', pendapatan: 6500000, pengeluaran: 3100000 },
    { bulan: 'Mei', pendapatan: 7800000, pengeluaran: 3400000 },
    { bulan: 'Jun', pendapatan: stats.pendapatanBulanIni || 8500000, pengeluaran: stats.pengeluaranBulanIni || 3800000 },
  ];

  const kategoriPengeluaranData = stats.kategoriPengeluaran || [
    { name: 'Bahan Baku (Sabun/Parfum)', value: 1200000 },
    { name: 'Utilitas (Air/Listrik)', value: 900000 },
    { name: 'Gaji Karyawan', value: 1500000 },
    { name: 'Maintenance Mesin', value: 200000 },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Dashboard */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Dashboard Ringkasan</h1>
          <p className="page-subtitle" style={{ color: '#6B7280', fontSize: '14px' }}>Pantau performa operasional dan finansial laundry Anda</p>
        </div>
        <Link to="/transaksi/baru" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontWeight: '600' }}>
          <FiPlus /> Transaksi Baru
        </Link>
      </div>

      {/* Stats Cards (4 Kolom Grid) */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="stat-card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Total Pelanggan</p>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: '#111827' }}>{stats.totalPelanggan}</h3>
            </div>
            <div className="stat-card-icon" style={{ background: '#EEF2F6', color: '#3B82F6', padding: '12px', borderRadius: '10px' }}><FiUsers size={20} /></div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Transaksi Hari Ini</p>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: '#111827' }}>{stats.transaksiHariIni}</h3>
            </div>
            <div className="stat-card-icon" style={{ background: '#ECFDF5', color: '#10B981', padding: '12px', borderRadius: '10px' }}><FiShoppingBag size={20} /></div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Pendapatan Hari Ini</p>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: '#111827' }}>{formatCurrency(stats.pendapatanHariIni)}</h3>
            </div>
            <div className="stat-card-icon" style={{ background: '#FFFBEB', color: '#F59E0B', padding: '12px', borderRadius: '10px' }}><FiDollarSign size={20} /></div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>Total Pengeluaran (Bulan Ini)</p>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: '#EF4444' }}>{formatCurrency(stats.pengeluaranBulanIni || 3800000)}</h3>
            </div>
            <div className="stat-card-icon" style={{ background: '#FEF2F2', color: '#EF4444', padding: '12px', borderRadius: '10px' }}><FiArrowDownRight size={20} /></div>
          </div>
        </div>
      </div>

      {/* SECTION GRAFIK (Pendapatan vs Pengeluaran & Breakdown Pengeluaran) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }} className="charts-grid">
        {/* Tren Keuangan Area Chart */}
        <div className="card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Cash Flow Bulanan</h3>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Perbandingan pendapatan bersih dan pengeluaran operasional</p>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trenKeuanganData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="bulan" stroke="#9CA3AF" fontSize={12} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp${v/1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorPendapatan)" />
                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPengeluaran)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Pengeluaran Pie Chart */}
        <div className="card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Alokasi Pengeluaran</h3>
            <p style={{ fontSize: '13px', color: '#6B7280' }}>Bulan berjalan</p>
          </div>
          <div style={{ width: '100%', height: 200, position: 'relative', flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kategoriPengeluaranData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {kategoriPengeluaranData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend manual di bawah pie chart agar rapi */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', marginTop: '12px' }}>
            {kategoriPengeluaranData.map((item, index) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length], display: 'inline-block' }}></span>
                <span style={{ color: '#4B5563', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item.name}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Bawah: Status Cucian & Transaksi Terbaru */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }} className="dashboard-grid">
        
        {/* Status Cucian */}
        <div className="card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <h3 className="card-title" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Status Cucian</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(stats.statusCount).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusColors[status] }}></span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#4B5563' }}>{STATUS_LABELS[status]}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', background: '#F3F4F6', padding: '4px 10px', borderRadius: '20px', color: '#111827' }}>
                  {count} Transaksi
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaksi Terbaru */}
        <div className="card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #F3F4F6' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Transaksi Terbaru</h3>
            <Link to="/transaksi" className="btn btn-secondary btn-sm" style={{ fontSize: '12px', padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', background: '#FFF', color: '#4B5563', textDecoration: 'none' }}>Lihat Semua</Link>
          </div>
          {stats.transaksiTerbaru.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0', textAlign: 'center', color: '#9CA3AF' }}>
              <p>Belum ada transaksi hari ini.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #F3F4F6', color: '#6B7280' }}>
                    <th style={{ padding: '12px 8px' }}>Kode</th>
                    <th style={{ padding: '12px 8px' }}>Pelanggan</th>
                    <th style={{ padding: '12px 8px' }}>Tanggal</th>
                    <th style={{ padding: '12px 8px' }}>Total</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.transaksiTerbaru.map((t) => (
                    <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6', color: '#111827' }}>
                      <td style={{ padding: '12px 8px', fontWeight: '600', color: '#4F46E5' }}>{t.kode}</td>
                      <td style={{ padding: '12px 8px' }}>{t.pelangganNama}</td>
                      <td style={{ padding: '12px 8px', color: '#6B7280' }}>{formatDateTime(t.createdAt)}</td>
                      <td style={{ padding: '12px 8px', fontWeight: '500' }}>{formatCurrency(t.total)}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span className={getStatusBadgeClass(t.status)} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                          {STATUS_LABELS[t.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardOwner;