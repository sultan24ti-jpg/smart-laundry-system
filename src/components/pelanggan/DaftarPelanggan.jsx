import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiUsers, FiClock, FiPackage } from 'react-icons/fi';
import { getAllPelanggan, deletePelanggan, getTransaksiByPelangganId, STATUS_LABELS } from '../../services/database';
import { formatDate, formatDateTime, formatCurrency, getStatusBadgeClass } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const DaftarPelanggan = () => {
  const toast = useToast();
  const [pelanggan, setPelanggan] = useState([]);
  const [search, setSearch] = useState('');

  const [riwayatFor, setRiwayatFor] = useState(null); // pelanggan yang sedang dilihat riwayatnya
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => setPelanggan(await getAllPelanggan());

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Hapus data pelanggan "${nama}"?`)) {
      try {
        await deletePelanggan(id);
        toast.success('Data pelanggan berhasil dihapus');
        load();
      } catch (err) {
        toast.error(err.message || 'Gagal menghapus pelanggan');
      }
    }
  };

  const handleLihatRiwayat = async (p) => {
    setRiwayatFor(p);
    setLoadingRiwayat(true);
    try {
      const data = await getTransaksiByPelangganId(p.id);
      setRiwayat(data);
    } catch (err) {
      toast.error(err.message || 'Gagal memuat riwayat transaksi');
      setRiwayat([]);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  const closeRiwayat = () => {
    setRiwayatFor(null);
    setRiwayat([]);
  };

  const filtered = pelanggan.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.nohp.includes(search)
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Daftar Pelanggan</h1>
          <p className="page-subtitle">{pelanggan.length} pelanggan terdaftar</p>
        </div>
      </div>

      <div className="card">
        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <FiSearch />
          <input
            type="text"
            placeholder="Cari nama atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><FiUsers size={40} /><p>Belum ada data pelanggan.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Nama</th><th>No. HP</th><th>Total Transaksi</th><th>Terdaftar</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="text-bold">{p.nama}</td>
                    <td>{p.nohp || '-'}</td>
                    <td>{p.totalTransaksi || 0}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleLihatRiwayat(p)}
                          title="Lihat Riwayat Transaksi"
                        >
                          <FiClock />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.nama)} title="Hapus Pelanggan">
                          <FiTrash2 />
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

      {/* Modal Riwayat Transaksi Pelanggan */}
      {riwayatFor && (
        <div
          className="modal-overlay"
          onClick={closeRiwayat}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17, 24, 39, 0.4)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 1000 }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#FFF', borderRadius: '16px', width: '92%', maxWidth: '700px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #E5E7EB' }}
          >
            <div className="modal-header" style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>Riwayat Transaksi</h3>
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{riwayatFor.nama} &middot; {riwayatFor.nohp || '-'}</span>
              </div>
              <button onClick={closeRiwayat} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#9CA3AF' }}>&times;</button>
            </div>

            <div className="modal-body" style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
              {loadingRiwayat ? (
                <p className="text-muted" style={{ textAlign: 'center', padding: '20px 0' }}>Memuat riwayat...</p>
              ) : riwayat.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 0', textAlign: 'center', color: '#9CA3AF' }}>
                  <FiPackage size={36} style={{ marginBottom: '10px', color: '#D1D5DB' }} />
                  <p style={{ margin: 0 }}>Pelanggan ini belum memiliki transaksi.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {riwayat.map((t) => (
                    <div
                      key={t.id}
                      style={{ border: '1px solid #F3F4F6', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: '#4F46E5', fontSize: '14px' }}>{t.kode}</div>
                        <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>{formatDateTime(t.createdAt)}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span className={getStatusBadgeClass(t.status)} style={{ padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                          {STATUS_LABELS[t.status]}
                        </span>
                        <span style={{ fontWeight: '700', color: '#111827', fontSize: '14px', minWidth: '90px', textAlign: 'right' }}>
                          {formatCurrency(t.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaftarPelanggan;
