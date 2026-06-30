import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import {
  getTransaksiById,
  updateTransaksiStatus,
  getNextStatus,
  STATUS_LABELS,
} from '../../services/database';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const ALL_STATUS = ['diterima', 'proses', 'siap_diambil', 'selesai', 'batal'];

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [transaksi, setTransaksi] = useState(null);
  const [note, setNote] = useState('');
  const [targetStatus, setTargetStatus] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const t = await getTransaksiById(id);
        if (cancelled) return;
        if (!t) {
          toast.error('Transaksi tidak ditemukan');
          navigate('/transaksi');
          return;
        }
        setTransaksi(t);
        setTargetStatus(getNextStatus(t.status) || t.status);
      } catch (err) {
        if (!cancelled) toast.error(err.message || 'Gagal memuat transaksi');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!transaksi) return null;

  const handleUpdate = async () => {
    try {
      await updateTransaksiStatus(transaksi.id, targetStatus, note);
      toast.success(`Status diperbarui menjadi "${STATUS_LABELS[targetStatus]}"`);
      setTransaksi(await getTransaksiById(id));
      setNote('');
    } catch (err) {
      toast.error(err.message || 'Gagal memperbarui status');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Update Status Transaksi</h1>
          <p className="page-subtitle">{transaksi.kode}</p>
        </div>
        <Link to="/transaksi" className="btn btn-secondary"><FiArrowLeft /> Kembali</Link>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Informasi Transaksi</h3></div>
        <p><strong>Pelanggan:</strong> {transaksi.pelangganNama} ({transaksi.pelangganNohp})</p>
        <p><strong>Total:</strong> {formatCurrency(transaksi.total)}</p>
        <p><strong>Status Saat Ini:</strong> <span className={getStatusBadgeClass(transaksi.status)}>{STATUS_LABELS[transaksi.status]}</span></p>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Ubah Status</h3></div>
        <div className="form-group">
          <label className="form-label">Status Baru</label>
          <select className="form-select" value={targetStatus} onChange={(e) => setTargetStatus(e.target.value)}>
            {ALL_STATUS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Catatan (Opsional)</label>
          <textarea
            className="form-textarea"
            rows={2}
            placeholder="Contoh: sudah selesai dicuci, siap diambil pelanggan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleUpdate} disabled={targetStatus === transaksi.status}>
          <FiCheckCircle /> Perbarui Status
        </button>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Riwayat Status</h3></div>
        <div className="timeline">
          {transaksi.history.map((h, i) => (
            <div key={i} className="timeline-item">
              <div className="text-bold">{STATUS_LABELS[h.status]}</div>
              <div className="text-muted" style={{ fontSize: '13px' }}>{formatDateTime(h.at)}</div>
              {h.note && <div style={{ fontSize: '13px' }}>{h.note}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
