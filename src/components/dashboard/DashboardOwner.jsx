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
          <FiLoader className="spin" size={40} style={{ color: 'var(--primary)' }} />
          <p style={{ marginTop: '16px', color: 'var(--gray-500)', fontWeight: 500 }}>Memuat data analitik...</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    diterima: '#F59E0B',
    proses: '#2F6FED',
    siap_diambil: '#12B886',
    selesai: '#FF4FA0',
  };

  const PIE_COLORS = ['#2F6FED', '#FF4FA0', '#12B886', '#F59E0B', '#EF4444'];

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
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Ringkasan</h1>
          <p className="page-subtitle">Pantau performa operasional dan finansial laundry Anda</p>
        </div>
        <Link to="/transaksi/baru" className="btn btn-primary">
          <FiPlus /> Transaksi Baru
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <p className="stat-card-label">Total Pelanggan</p>
              <h3 className="stat-card-value" style={{ marginTop: '6px' }}>{stats.totalPelanggan}</h3>
            </div>
            <div className="stat-card-icon blue" style={{ marginBottom: 0 }}><FiUsers size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <p className="stat-card-label">Transaksi Hari Ini</p>
              <h3 className="stat-card-value" style={{ marginTop: '6px' }}>{stats.transaksiHariIni}</h3>
            </div>
            <div className="stat-card-icon green" style={{ marginBottom: 0 }}><FiShoppingBag size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <p className="stat-card-label">Pendapatan Hari Ini</p>
              <h3 className="stat-card-value" style={{ marginTop: '6px' }}>{formatCurrency(stats.pendapatanHariIni)}</h3>
            </div>
            <div className="stat-card-icon yellow" style={{ marginBottom: 0 }}><FiDollarSign size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex-between" style={{ alignItems: 'flex-start' }}>
            <div>
              <p className="stat-card-label">Total Pengeluaran (Bulan Ini)</p>
              <h3 className="stat-card-value" style={{ marginTop: '6px', color: 'var(--pink-dark)' }}>{formatCurrency(stats.pengeluaranBulanIni || 3800000)}</h3>
            </div>
            <div className="stat-card-icon pink" style={{ marginBottom: 0 }}><FiArrowDownRight size={20} /></div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header" style={{ display: 'block', border: 'none', paddingBottom: 0, marginBottom: '10px' }}>
            <h3 className="card-title">Cash Flow Bulanan</h3>
            <p className="page-subtitle" style={{ marginTop: '4px' }}>Perbandingan pendapatan bersih dan pengeluaran operasional</p>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trenKeuanganData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6FED" stopOpacity={0.28}/>
                    <stop offset="95%" stopColor="#2F6FED" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4FA0" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#FF4FA0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E7F1" />
                <XAxis dataKey="bulan" stroke="#98A4BD" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#98A4BD" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp${v/1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #E1E7F1' }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="pendapatan" name="Pendapatan" stroke="#2F6FED" strokeWidth={3} fillOpacity={1} fill="url(#colorPendapatan)" />
                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#FF4FA0" strokeWidth={3} fillOpacity={1} fill="url(#colorPengeluaran)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ display: 'block', border: 'none', paddingBottom: 0, marginBottom: '10px' }}>
            <h3 className="card-title">Alokasi Pengeluaran</h3>
            <p className="page-subtitle" style={{ marginTop: '4px' }}>Bulan berjalan</p>
          </div>
          <div style={{ width: '100%', height: 190, flexGrow: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kategoriPengeluaranData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={5}
                  cornerRadius={8}
                  dataKey="value"
                  stroke="none"
                >
                  {kategoriPengeluaranData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: 12, border: '1px solid #E1E7F1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginTop: '12px' }}>
            {kategoriPengeluaranData.map((item, index) => (
              <div key={item.name} className="flex" style={{ alignItems: 'center', gap: '7px' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: PIE_COLORS[index % PIE_COLORS.length], display: 'inline-block', flexShrink: 0 }}></span>
                <span className="text-muted" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item.name}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status + Transaksi terbaru */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Status Cucian</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(stats.statusCount).map(([status, count]) => (
              <div key={status} className="flex-between" style={{ paddingBottom: '12px', borderBottom: '1px dashed var(--gray-200)' }}>
                <div className="flex" style={{ alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: statusColors[status] }}></span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gray-700)' }}>{STATUS_LABELS[status]}</span>
                </div>
                <span className="badge badge-process">{count} Transaksi</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Transaksi Terbaru</h3>
            <Link to="/transaksi" className="btn btn-secondary btn-sm">Lihat Semua</Link>
          </div>
          {stats.transaksiTerbaru.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada transaksi hari ini.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Pelanggan</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.transaksiTerbaru.map((t) => (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{t.kode}</td>
                      <td>{t.pelangganNama}</td>
                      <td className="text-muted">{formatDateTime(t.createdAt)}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(t.total)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(t.status)}`}>
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
