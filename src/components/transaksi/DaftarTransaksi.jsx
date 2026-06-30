import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiTrash2, FiPlus, FiPackage, FiInfo, FiClock, FiCheckCircle } from 'react-icons/fi';
import { getAllTransaksi, deleteTransaksi, STATUS_LABELS } from '../../services/database';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const DaftarTransaksi = () => {
  const toast = useToast();
  const [transaksi, setTransaksi] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => setTransaksi(await getAllTransaksi());

  const handleDelete = async (id, kode) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus transaksi ${kode}? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        await deleteTransaksi(id);
        toast.success('Transaksi berhasil dihapus');
        load();
      } catch (err) {
        toast.error(err.message || 'Gagal menghapus transaksi');
      }
    }
  };

  const filtered = transaksi.filter((t) => {
    const matchSearch =
      t.kode.toLowerCase().includes(search.toLowerCase()) ||
      t.pelangganNama.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Keterangan Ringkas Finansial dari Data yang Disaring
  const totalNilaiFiltered = filtered.reduce((acc, curr) => acc + curr.total, 0);
  const totalTransaksiProses = filtered.filter(t => t.status === 'proses' || t.status === 'diterima').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: 0 }}>Daftar Transaksi</h1>
          <p className="page-subtitle" style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Kelola dan pantau seluruh catatan pesanan laundry masuk</p>
        </div>
        <Link to="/transaksi/baru" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>
          <FiPlus /> Transaksi Baru
        </Link>
      </div>

      {/* Info Keterangan / Ringkasan Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#EEF2F6', color: '#3B82F6', padding: '10px', borderRadius: '8px' }}><FiPackage size={18} /></div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Hasil Filter</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{filtered.length} Transaksi</div>
          </div>
        </div>
        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#FFFBEB', color: '#D97706', padding: '10px', borderRadius: '8px' }}><FiClock size={18} /></div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Dalam Antrean/Proses</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{totalTransaksiProses} Pesanan</div>
          </div>
        </div>
        <div style={{ background: '#F9FAFB', padding: '16px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#ECFDF5', color: '#059669', padding: '10px', borderRadius: '8px' }}><FiCheckCircle size={18} /></div>
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>Akumulasi Nilai</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{formatCurrency(totalNilaiFiltered)}</div>
          </div>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="card" style={{ background: '#FFF', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #F3F4F6' }}>
        
        {/* Filters bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '10px 16px', borderRadius: '8px', flexGrow: 1, maxWidth: '450px' }}>
            <FiSearch style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Cari kode atau nama pelanggan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#111827' }}
            />
          </div>
          <select 
            className="form-select" 
            style={{ minWidth: '180px', padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFF', fontSize: '14px', color: '#4B5563', outline: 'none' }} 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">🟢 Semua Status</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table / Empty State conditional */}
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 24px', textAlign: 'center', color: '#9CA3AF' }}>
            <FiPackage size={48} style={{ marginBottom: '16px', color: '#D1D5DB' }} />
            <p style={{ fontSize: '15px', fontWeight: '500', margin: 0 }}>Tidak ada transaksi yang cocok dengan kriteria pencarian.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F4F6', color: '#6B7280', fontWeight: '600' }}>
                  <th style={{ padding: '14px 12px' }}>Kode Transaksi</th>
                  <th style={{ padding: '14px 12px' }}>Informasi Pelanggan</th>
                  <th style={{ padding: '14px 12px' }}>Waktu Masuk</th>
                  <th style={{ padding: '14px 12px' }}>Total Tagihan</th>
                  <th style={{ padding: '14px 12px' }}>Status</th>
                  <th style={{ padding: '14px 12px', textAlignment: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.2s' }} className="table-row-hover">
                    <td style={{ padding: '16px 12px', fontWeight: '600', color: '#4F46E5' }}>{t.kode}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ fontWeight: '600', color: '#111827' }}>{t.pelangganNama}</div>
                      <div style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>{t.pelangganNohp}</div>
                    </td>
                    <td style={{ padding: '16px 12px', color: '#4B5563' }}>{formatDateTime(t.createdAt)}</td>
                    <td style={{ padding: '16px 12px', fontWeight: '600', color: '#111827' }}>{formatCurrency(t.total)}</td>
                    <td style={{ padding: '16px 12px' }}>
                      <span className={getStatusBadgeClass(t.status)} style={{ padding: '6px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', display: 'inline-block' }}>
                        {STATUS_LABELS[t.status]}
                      </span>
                    </td>
                    <td style={{ padding: '16px 12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          style={{ padding: '6px 10px', background: '#F3F4F6', border: 'none', borderRadius: '6px', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
                          onClick={() => setSelected(t)}
                          title="Lihat Rincian Detail"
                        >
                          <FiEye size={15} />
                        </button>
                        <button 
                          style={{ padding: '6px 10px', background: '#FEF2F2', border: 'none', borderRadius: '6px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }} 
                          onClick={() => handleDelete(t.id, t.kode)}
                          title="Hapus Transaksi"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Detail Modal Side/Center Drop */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 1000 }}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ background: '#FFF', borderRadius: '16px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
            
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>Detail Nota: {selected.kode}</h3>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Dibuat pada: {formatDateTime(selected.createdAt)}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#9CA3AF' }}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
              
              {/* Grid Informasi Atas */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#F9FAFB', padding: '16px', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' }}>Nama Pelanggan</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginTop: '2px' }}>{selected.pelangganNama}</div>
                  <div style={{ fontSize: '13px', color: '#4B5563' }}>{selected.pelangganNohp}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' }}>Status & Estimasi</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className={getStatusBadgeClass(selected.status)} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '6px' }}>🕒 {formatDateTime(selected.estimasiSelesai)}</div>
                </div>
              </div>

              {/* Catatan Khusus */}
              {selected.catatan && (
                <div style={{ marginBottom: '20px', padding: '12px', borderLeft: '4px solid #F59E0B', background: '#FFFBEB', borderRadius: '0 8px 8px 0', fontSize: '13px' }}>
                  <div style={{ fontWeight: '600', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}><FiInfo size={14}/> Catatan Khusus Internal:</div>
                  <p style={{ margin: '4px 0 0 0', color: '#78350F' }}>"{selected.catatan}"</p>
                </div>
              )}

              {/* Rincian Item Layanan */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Rincian Keranjang Cucian:</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#F3F4F6', color: '#4B5563', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px', borderRadius: '6px 0 0 6px' }}>Nama Layanan</th>
                      <th style={{ padding: '8px 12px' }}>Kuantitas</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((it, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '10px 12px', fontWeight: '500' }}>{it.namaLayanan}</td>
                        <td style={{ padding: '10px 12px', color: '#6B7280' }}>{it.qty} {it.satuan}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '600' }}>{formatCurrency(it.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Tagihan Akhir */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '2px dashed #E5E7EB' }}>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#4B5563' }}>Total Keseluruhan Tagihan</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{formatCurrency(selected.total)}</span>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '16px 24px', borderTop: '1px solid #F3F4F6', background: '#F9FAFB', display: 'flex', justifyContent: 'end' }}>
              <Link to={`/transaksi/${selected.id}/status`} className="btn btn-primary" style={{ textDecoration: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                Perbarui Progres / Status Cucian
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarTransaksi;