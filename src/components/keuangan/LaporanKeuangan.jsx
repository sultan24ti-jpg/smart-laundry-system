import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { getLaporanKeuangan } from '../../services/database';
import { formatCurrency, formatDate } from '../../utils/helpers';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const LaporanKeuangan = () => {
  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());
  const [report, setReport] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getLaporanKeuangan({ bulan, tahun }).then((data) => {
      if (!cancelled) setReport(data);
    });
    return () => {
      cancelled = true;
    };
  }, [bulan, tahun]);

  if (!report) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Laporan Keuangan</h1>
          <p className="page-subtitle">Ringkasan pemasukan dan pengeluaran bulanan</p>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Bulan</label>
            <select className="form-select" value={bulan} onChange={(e) => setBulan(Number(e.target.value))}>
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tahun</label>
            <input
              type="number"
              className="form-input"
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-icon green"><FiTrendingUp /></div>
          <div className="stat-card-value">{formatCurrency(report.totalPemasukan)}</div>
          <div className="stat-card-label">Total Pemasukan</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon red"><FiTrendingDown /></div>
          <div className="stat-card-value">{formatCurrency(report.totalPengeluaran)}</div>
          <div className="stat-card-label">Total Pengeluaran</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon blue"><FiDollarSign /></div>
          <div className="stat-card-value">{formatCurrency(report.labaBersih)}</div>
          <div className="stat-card-label">Laba Bersih</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Rincian Transaksi ({report.transaksi.length})</h3></div>
        {report.transaksi.length === 0 ? (
          <p className="text-muted">Tidak ada transaksi pada periode ini.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Kode</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th></tr></thead>
              <tbody>
                {report.transaksi.map((t) => (
                  <tr key={t.id}>
                    <td>{t.kode}</td>
                    <td>{t.pelangganNama}</td>
                    <td>{formatDate(t.createdAt)}</td>
                    <td>{formatCurrency(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Rincian Pengeluaran ({report.pengeluaran.length})</h3></div>
        {report.pengeluaran.length === 0 ? (
          <p className="text-muted">Tidak ada pengeluaran pada periode ini.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Keterangan</th><th>Kategori</th><th>Tanggal</th><th>Jumlah</th></tr></thead>
              <tbody>
                {report.pengeluaran.map((p) => (
                  <tr key={p.id}>
                    <td>{p.keterangan}</td>
                    <td>{p.kategori}</td>
                    <td>{formatDate(p.tanggal)}</td>
                    <td>{formatCurrency(p.jumlah)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanKeuangan;
