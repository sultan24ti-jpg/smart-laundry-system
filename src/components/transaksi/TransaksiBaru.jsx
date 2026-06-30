import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiSave } from 'react-icons/fi';
import { getLayananAktif, createTransaksi } from '../../services/database';
import { formatCurrency, validatePhone } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const TransaksiBaru = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [layananList, setLayananList] = useState([]);

  const [pelanggan, setPelanggan] = useState({ nama: '', nohp: '', alamat: '' });
  const [items, setItems] = useState([{ layananId: '', qty: 1 }]);
  const [catatan, setCatatan] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLayananAktif().then(setLayananList);
  }, []);

  const addItem = () => setItems([...items, { layananId: '', qty: 1 }]);

  const removeItem = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, field, value) => {
    const newItems = [...items];
    newItems[idx][field] = field === 'qty' ? Number(value) : value;
    setItems(newItems);
  };

  const getHarga = (layananId) => {
    const l = layananList.find((x) => x.id === layananId);
    return l ? l.harga : 0;
  };

  const getSatuan = (layananId) => {
    const l = layananList.find((x) => x.id === layananId);
    return l ? l.satuan : '';
  };

  const total = items.reduce((sum, it) => sum + (it.qty || 0) * getHarga(it.layananId), 0);

  const validate = () => {
    const newErrors = {};
    if (!pelanggan.nama.trim()) newErrors.nama = 'Nama pelanggan wajib diisi';
    if (!pelanggan.nohp.trim()) newErrors.nohp = 'Nomor HP wajib diisi';
    else if (!validatePhone(pelanggan.nohp)) newErrors.nohp = 'Format nomor HP tidak valid';
    if (items.some((it) => !it.layananId)) newErrors.items = 'Pilih layanan untuk setiap item';
    if (items.some((it) => !it.qty || it.qty <= 0)) newErrors.items = 'Jumlah harus lebih dari 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Periksa kembali data yang diisi');
      return;
    }

    setLoading(true);
    const finalItems = items.map((it) => {
      const lyn = layananList.find((l) => l.id === it.layananId);
      return {
        layananId: it.layananId,
        namaLayanan: lyn.nama,
        satuan: lyn.satuan,
        qty: it.qty,
        harga: lyn.harga,
        subtotal: it.qty * lyn.harga,
      };
    });

    try {
      const trx = await createTransaksi({ pelanggan, items: finalItems, catatan });
      toast.success(`Transaksi ${trx.kode} berhasil dibuat`);
      navigate('/transaksi');
    } catch (err) {
      toast.error(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaksi Baru</h1>
          <p className="page-subtitle">Catat transaksi laundry pelanggan</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header"><h3 className="card-title">Data Pelanggan</h3></div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nama Pelanggan</label>
              <input
                type="text"
                className={`form-input ${errors.nama ? 'error' : ''}`}
                placeholder="Nama pelanggan"
                value={pelanggan.nama}
                onChange={(e) => setPelanggan({ ...pelanggan, nama: e.target.value })}
              />
              {errors.nama && <span className="form-error">{errors.nama}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Nomor HP</label>
              <input
                type="tel"
                className={`form-input ${errors.nohp ? 'error' : ''}`}
                placeholder="08xxxxxxxxxx"
                value={pelanggan.nohp}
                onChange={(e) => setPelanggan({ ...pelanggan, nohp: e.target.value })}
              />
              {errors.nohp && <span className="form-error">{errors.nohp}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Alamat (Opsional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Alamat pelanggan"
              value={pelanggan.alamat}
              onChange={(e) => setPelanggan({ ...pelanggan, alamat: e.target.value })}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Item Layanan</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              <FiPlus /> Tambah Item
            </button>
          </div>

          {items.map((it, idx) => (
            <div key={idx} className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr auto', alignItems: 'end', marginBottom: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Layanan</label>
                <select
                  className="form-select"
                  value={it.layananId}
                  onChange={(e) => updateItem(idx, 'layananId', e.target.value)}
                >
                  <option value="">-- Pilih Layanan --</option>
                  {layananList.map((l) => (
                    <option key={l.id} value={l.id}>{l.nama} ({formatCurrency(l.harga)}/{l.satuan})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Jumlah ({getSatuan(it.layananId) || 'satuan'})</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={it.qty}
                  onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Subtotal</label>
                <input
                  type="text"
                  className="form-input"
                  disabled
                  value={formatCurrency((it.qty || 0) * getHarga(it.layananId))}
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-icon"
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          {errors.items && <span className="form-error">{errors.items}</span>}

          <div className="form-group">
            <label className="form-label">Catatan (Opsional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Contoh: jangan pakai pewangi, ada kancing lepas, dll."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>

          <div className="flex-between" style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px' }}>
            <h3>Total</h3>
            <h2 style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</h2>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          <FiSave /> {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
        </button>
      </form>
    </div>
  );
};

export default TransaksiBaru;
