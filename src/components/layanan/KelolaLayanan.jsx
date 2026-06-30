import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX } from 'react-icons/fi';
import {
  getAllLayanan,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from '../../services/database';
import { formatCurrency } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const emptyForm = { nama: '', satuan: 'kg', harga: '', durasiHari: 1, aktif: true };

const KelolaLayanan = () => {
  const toast = useToast();
  const [layanan, setLayanan] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => setLayanan(await getAllLayanan());

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (l) => {
    setForm({ nama: l.nama, satuan: l.satuan, harga: l.harga, durasiHari: l.durasiHari, aktif: l.aktif });
    setEditingId(l.id);
    setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nama.trim()) newErrors.nama = 'Nama layanan wajib diisi';
    if (!form.harga || Number(form.harga) <= 0) newErrors.harga = 'Harga harus lebih dari 0';
    if (!form.durasiHari || Number(form.durasiHari) <= 0) newErrors.durasiHari = 'Durasi minimal 1 hari';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    const data = { ...form, harga: Number(form.harga), durasiHari: Number(form.durasiHari) };

    try {
      if (editingId) {
        await updateLayanan(editingId, data);
        toast.success('Layanan berhasil diperbarui');
      } else {
        await createLayanan(data);
        toast.success('Layanan berhasil ditambahkan');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan layanan');
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Hapus layanan "${nama}"?`)) {
      try {
        await deleteLayanan(id);
        toast.success('Layanan berhasil dihapus');
        load();
      } catch (err) {
        toast.error(err.message || 'Gagal menghapus layanan');
      }
    }
  };

  const toggleAktif = async (l) => {
    try {
      await updateLayanan(l.id, { aktif: !l.aktif });
      load();
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah status layanan');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Kelola Layanan</h1>
          <p className="page-subtitle">{layanan.length} layanan terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Tambah Layanan</button>
      </div>

      <div className="card">
        {layanan.length === 0 ? (
          <div className="empty-state"><FiPackage size={40} /><p>Belum ada layanan.</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Nama Layanan</th><th>Satuan</th><th>Harga</th><th>Durasi</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {layanan.map((l) => (
                  <tr key={l.id}>
                    <td className="text-bold">{l.nama}</td>
                    <td>{l.satuan}</td>
                    <td>{formatCurrency(l.harga)}</td>
                    <td>{l.durasiHari} hari</td>
                    <td>
                      <span
                        className={`badge ${l.aktif ? 'badge-ready' : 'badge-cancel'}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggleAktif(l)}
                      >
                        {l.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(l)}><FiEdit2 /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id, l.nama)}><FiTrash2 /></button>
                      </div>
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
              <h3>{editingId ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Layanan</label>
                <input
                  type="text"
                  className={`form-input ${errors.nama ? 'error' : ''}`}
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                />
                {errors.nama && <span className="form-error">{errors.nama}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Satuan</label>
                  <select className="form-select" value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })}>
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="pasang">pasang</option>
                    <option value="set">set</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Harga (Rp)</label>
                  <input
                    type="number"
                    className={`form-input ${errors.harga ? 'error' : ''}`}
                    value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  />
                  {errors.harga && <span className="form-error">{errors.harga}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Durasi Pengerjaan (hari)</label>
                <input
                  type="number"
                  className={`form-input ${errors.durasiHari ? 'error' : ''}`}
                  value={form.durasiHari}
                  onChange={(e) => setForm({ ...form, durasiHari: e.target.value })}
                />
                {errors.durasiHari && <span className="form-error">{errors.durasiHari}</span>}
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

export default KelolaLayanan;
