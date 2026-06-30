import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { getLayananAktif } from '../../services/database';
import { formatCurrency } from '../../utils/helpers';

// Halaman publik untuk menampilkan daftar layanan yang tersedia
const DaftarLayanan = () => {
  const [layanan, setLayanan] = useState([]);

  useEffect(() => {
    getLayananAktif().then(setLayanan);
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daftar Layanan</h1>
          <p className="page-subtitle">Layanan laundry yang tersedia untuk pelanggan</p>
        </div>
      </div>

      {layanan.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={40} />
          <p>Belum ada layanan tersedia.</p>
        </div>
      ) : (
        <div className="service-grid">
          {layanan.map((l) => (
            <div key={l.id} className="service-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="stat-card-icon blue" style={{ width: 44, height: 44, borderRadius: 16 }}><FiPackage /></div>
                <div>
                  <h4>{l.nama}</h4>
                  <p className="service-meta">Per {l.satuan} • Estimasi {l.durasiHari} hari</p>
                </div>
              </div>
              <div className="service-footer">
                <span className="price-tag">{formatCurrency(l.harga)}</span>
                <span className="service-badge">Tersedia</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/transaksi/baru" className="btn btn-primary">Buat Transaksi</Link>
      </div>
    </div>
  );
};

export default DaftarLayanan;
