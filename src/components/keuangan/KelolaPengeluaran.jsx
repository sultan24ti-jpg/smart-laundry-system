import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiTrendingDown, FiX } from 'react-icons/fi';
import { getAllPengeluaran, createPengeluaran, deletePengeluaran } from '../../services/database';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const KATEGORI = ['Listrik', 'Air', 'Sabun & Bahan Cuci', 'Gaji Karyawan', 'Perawatan Mesin', 'Lainnya'];
const emptyForm = { keterangan: '', kategori: KATEGORI[0], jumlah: '', tanggal: new Date().toISOString().slice(0, 10) };

const KelolaPengeluaran = () => {
  const toast = useToast();
  const [pengeluaran, setPengeluaran] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => setPengeluaran(await getAllPengeluaran());

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.keterangan.trim()) newErrors.keterangan = 'Keterangan wajib diisi';
    if (!form.jumlah || Number(form.jumlah) <= 0) newErrors.jumlah = 'Jumlah harus lebih dari 0';
    if (!form.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await createPengeluaran({ ...form, jumlah: Number(form.jumlah) });
      toast.success('Pengeluaran berhasil ditambahkan');
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan pengeluaran');
    }
  };

  const handleDelete = async (id, ket) => {
    if (window.confirm(`Hapus pengeluaran "${ket}"?`)) {
      try {
        await deletePengeluaran(id);
        toast.success('Pengeluaran berhasil dihapus');
        load();
      } catch (err) {
        toast.error(err.message || 'Gagal menghapus pengeluaran');
      }
    }
  };

  const totalSemua = pengeluaran.reduce((sum, p) => sum + Number(p.jumlah), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Pengeluaran</h1>
          <p className="page-subtitle">Total: {formatCurrency(totalSemua)}</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Tambah Pengeluaran</button>
      </div>

      <div className="card">
        {pengeluaran.length === 0 ? (
          <div className="empty-state"><FiTrendingDown size={40} /><p>Belum ada pengeluaran tercatat.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Keterangan</th><th>Kategori</th><th>Tanggal</th><th>Jumlah</th><th>Aksi</th></tr></thead>
              <tbody>
                {pengeluaran.map((p) => (
                  <tr key={p.id}>
                    <td className="text-bold">{p.keterangan}</td>
                    <td>{p.kategori}</td>
                    <td>{formatDate(p.tanggal)}</td>
                    <td className="text-danger">{formatCurrency(p.jumlah)}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.keterangan)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Pengeluaran</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Keterangan</label>
                <input
                  type="text"
                  className={`form-input ${errors.keterangan ? 'error' : ''}`}
                  value={form.keterangan}
                  onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                />
                {errors.keterangan && <span className="form-error">{errors.keterangan}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select className="form-select" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}>
                  {KATEGORI.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Jumlah (Rp)</label>
                  <input
                    type="number"
                    className={`form-input ${errors.jumlah ? 'error' : ''}`}
                    value={form.jumlah}
                    onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
                  />
                  {errors.jumlah && <span className="form-error">{errors.jumlah}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Tanggal</label>
                  <input
                    type="date"
                    className={`form-input ${errors.tanggal ? 'error' : ''}`}
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  />
                  {errors.tanggal && <span className="form-error">{errors.tanggal}</span>}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KelolaPengeluaran;
