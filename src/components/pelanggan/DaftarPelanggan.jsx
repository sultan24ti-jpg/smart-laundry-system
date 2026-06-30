import React, { useState, useEffect } from 'react';
import { FiSearch, FiTrash2, FiUsers } from 'react-icons/fi';
import { getAllPelanggan, deletePelanggan } from '../../services/database';
import { formatDate } from '../../utils/helpers';
import { useToast } from '../common/Toast';

const DaftarPelanggan = () => {
  const toast = useToast();
  const [pelanggan, setPelanggan] = useState([]);
  const [search, setSearch] = useState('');

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
                <tr><th>Nama</th><th>No. HP</th><th>Alamat</th><th>Total Transaksi</th><th>Terdaftar</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="text-bold">{p.nama}</td>
                    <td>{p.nohp || '-'}</td>
                    <td>{p.alamat || '-'}</td>
                    <td>{p.totalTransaksi || 0}</td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id, p.nama)}>
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
    </div>
  );
};

export default DaftarPelanggan;
