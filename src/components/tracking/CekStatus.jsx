import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage } from 'react-icons/fi';
import { getTransaksiByKode, getLayananAktif, STATUS_LABELS } from '../../services/database';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const CekStatus = () => {
  const toast = useToast();
  const [kode, setKode] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [layanan, setLayanan] = useState([]);

  useEffect(() => {
    const loadLayanan = async () => {
      try {
        const data = await getLayananAktif();
        setLayanan(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    loadLayanan();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!kode.trim()) {
      toast.error('Masukkan kode transaksi');
      return;
    }
    try {
      const trx = await getTransaksiByKode(kode.trim());
      setResult(trx || null);
      setSearched(true);
      if (!trx) toast.error('Transaksi tidak ditemukan');
    } catch (err) {
      toast.error(err.message || 'Gagal mengambil data transaksi');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Cek Status Cucian</h1>
          <p className="page-subtitle">Masukkan kode transaksi untuk melacak status cucian Anda</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-1" style={{ flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ maxWidth: '320px' }}
            placeholder="Contoh: LDY-20260621-001"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
          />
          <button type="submit" className="btn btn-primary"><FiSearch /> Cek Status</button>
        </form>

        {layanan.length > 0 && (
          <div className="service-grid" style={{ marginTop: '24px' }}>
            {layanan.map((l) => (
              <div key={l.id} className="service-card" style={{ minHeight: '140px' }}>
                <div>
                  <h4>{l.nama}</h4>
                  <p className="service-meta">Per {l.satuan} • Estimasi {l.durasiHari} hari</p>
                </div>
                <div className="service-footer">
                  <span className="price-tag">{formatCurrency(l.harga)}</span>
                  <span className="service-badge">Info Layanan</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {searched && !result && (
          <div className="empty-state">
            <FiPackage size={40} />
            <p>Kode transaksi tidak ditemukan. Periksa kembali kode Anda.</p>
          </div>
        )}

        {result && (
          <div className="tracking-result">
            <div className="flex-between mb-2">
              <h3>{result.kode}</h3>
              <span className={getStatusBadgeClass(result.status)}>{STATUS_LABELS[result.status]}</span>
            </div>
            <p><strong>Pelanggan:</strong> {result.pelangganNama}</p>
            <p><strong>Estimasi Selesai:</strong> {formatDateTime(result.estimasiSelesai)}</p>
            <p><strong>Total:</strong> {formatCurrency(result.total)}</p>

            <h4 className="mt-2 mb-1">Item Layanan</h4>
            <ul style={{ paddingLeft: '20px' }}>
              {result.items.map((it, i) => (
                <li key={i}>{it.namaLayanan} - {it.qty} {it.satuan} ({formatCurrency(it.subtotal)})</li>
              ))}
            </ul>

            <h4 className="mt-2 mb-1">Riwayat Status</h4>
            <div className="timeline">
              {result.history.map((h, i) => (
                <div key={i} className="timeline-item">
                  <div className="text-bold">{STATUS_LABELS[h.status]}</div>
                  <div className="text-muted" style={{ fontSize: '13px' }}>{formatDateTime(h.at)}</div>
                  {h.note && <div style={{ fontSize: '13px' }}>{h.note}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CekStatus;
