import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiClock, FiUser, FiDollarSign } from 'react-icons/fi';
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
        // Mengambil semua data layanan yang aktif di database kamu
        setLayanan(data); 
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

  // Helper disesuaikan dengan 6 jenis nama layanan asli dari database kamu
  // Silakan unduh gambar dan simpan dengan nama-nama file di bawah ini ke folder public/images/
  const getServiceIconPath = (nama) => {
    const n = nama.toLowerCase();
    
    if (n.includes('bed cover')) return '/images/cuci-bed-cover.png';
    if (n.includes('kering')) return '/images/cuci-kering.png';
    if (n.includes('sepatu')) return '/images/cuci-sepatu.png';
    if (n.includes('express')) return '/images/setrika-express.png';
    if (n.includes('reguler')) return '/images/setrika-reguler.png';
    if (n.includes('setrika saja')) return '/images/setrika-saja.png';
    if (n.includes('boneka')) return '/images/cuci-boneka.png';
    
    return '/images/default-service.png'; // Fallback jika ada penambahan nama baru
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* SECTION 1: HERO & TRACKING INPUT */}
      <div className="relative bg-white pt-16 pb-12 px-4 border-b border-slate-100 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase block mb-1">Tentang Kami</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#199bb1] tracking-tight mb-4">
            Layanan Smart Laundry System
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto mb-8">
            Masukkan kode nota belanja Anda di bawah ini untuk melihat status pengerjaan pakaian secara langsung.
          </p>

          {/* Form Pencarian */}
          <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-cyan-100/50 border border-cyan-100">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-cyan-500" />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition text-slate-700 font-medium placeholder-slate-400 text-sm"
                  placeholder="Masukkan nomor nota Anda..."
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-3 bg-[#199bb1] hover:bg-[#147e91] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm shrink-0"
              >
                Cek Status Cucian
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        
        {/* SECTION 2: TRACKING RESULT */}
        {searched && result && (
          <div className="bg-white rounded-3xl border border-cyan-100/70 shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#199bb1] to-cyan-500 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-100">Nomor Registrasi</span>
                <h2 className="text-xl font-black tracking-wide">{result.kode}</h2>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-white shadow-sm ${getStatusBadgeClass(result.status)}`}>
                {STATUS_LABELS[result.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-100 bg-cyan-50/20">
              <div className="p-5 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
                <FiUser className="text-cyan-500" size={18} />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Pelanggan</p>
                  <p className="text-sm font-bold text-slate-700">{result.pelangganNama}</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-3 border-b md:border-b-0 md:border-r border-slate-100">
                <FiClock className="text-amber-500" size={18} />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Estimasi Selesai</p>
                  <p className="text-sm font-bold text-slate-700">{formatDateTime(result.estimasiSelesai)}</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-3">
                <FiDollarSign className="text-emerald-500" size={18} />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Pembayaran</p>
                  <p className="text-sm font-black text-emerald-600">{formatCurrency(result.total)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3">🧺 Detail Keranjang</h4>
                <div className="space-y-2">
                  {result.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-xs">
                      <div>
                        <p className="font-bold text-slate-700">{it.namaLayanan}</p>
                        <p className="text-slate-400">{it.qty} {it.satuan}</p>
                      </div>
                      <span className="font-bold text-slate-600">{formatCurrency(it.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3">📍 Riwayat Pengerjaan</h4>
                <div className="relative pl-4 space-y-4 before:absolute before:bottom-1 before:top-1 before:left-[5px] before:w-[1px] before:bg-slate-200">
                  {result.history.map((h, i) => (
                    <div key={i} className="relative text-xs">
                      <div className={`absolute -left-[14px] top-1 w-2 h-2 rounded-full border bg-white ${i === 0 ? 'border-cyan-500 ring-4 ring-cyan-100' : 'border-slate-300'}`} />
                      <p className={`font-bold ${i === 0 ? 'text-cyan-600' : 'text-slate-600'}`}>{STATUS_LABELS[h.status]}</p>
                      <p className="text-slate-400 text-[11px]">{formatDateTime(h.at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: GRID LAYANAN UTAMA */}
        {layanan.length > 0 && (
          <div className="space-y-6 text-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
              {layanan.map((l) => (
                <div 
                  key={l.id} 
                  className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 hover:shadow-xl hover:border-cyan-200 transition-all duration-300 flex flex-col items-center justify-between text-center group min-h-[220px]"
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={getServiceIconPath(l.nama)} 
                      alt={l.nama}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => { e.target.src = '/images/default-service.png'; }} 
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#199bb1] tracking-tight">
                      {l.nama}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {formatCurrency(l.harga)} / {l.satuan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: ABOUT COMPANY */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-full md:w-2/5 aspect-[4/3] sm:aspect-square bg-slate-100 rounded-3xl overflow-visible shadow-md shrink-0">
            <img 
              src="/images/chingu-outlet.jpg" 
              alt="Chingu Laundry Outlet" 
              className="w-full h-full object-cover rounded-3xl"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Chingu+Laundry'; }}
            />
            
            <div className="absolute -bottom-5 -right-5 w-24 h-24 sm:w-28 sm:h-28 bg-white text-slate-800 rounded-full shadow-xl border border-slate-50 flex flex-col items-center justify-center z-20">
              <span className="text-xl sm:text-2xl font-black text-cyan-500 leading-none">9+</span>
              <span className="text-[9px] font-bold text-slate-400 text-center mt-1 uppercase tracking-tighter max-w-[70px]">
                Tahun <br />Pengalaman
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-left pt-4 md:pt-0">
            <span className="text-xs font-bold text-cyan-500 tracking-wider uppercase block">Tentang Kami</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#199bb1] leading-snug">
              Laundry Bersih, Wangi, Higienis, dan Tepat Waktu
            </h3>
            <div className="text-xs sm:text-sm text-slate-500 space-y-3 leading-relaxed">
              <p>
                <strong className="text-cyan-600">SMART LAUNDRY SYSTEM</strong> adalah layanan laundry kiloan dan satuan. Kami adalah tim profesional yang selalu mengutamakan kualitas cucian & pelayanan dengan prinsip bersih, rapi, wangi, higienis & tepat waktu.
              </p>
              <p>
                <strong className="text-cyan-600">SMART LAUNDRY SYSTEM</strong> menerima laundry kiloan untuk perusahaan, misal kantor, rumah sakit, asrama, pesantren, sekolah, perusahaan konveksi atau perusahaan-perusahaan semisal, silakan hubungi kami.
              </p>
            </div>

            <div className="bg-cyan-50/50 border border-cyan-100 p-3.5 rounded-xl flex items-start gap-3 text-xs text-cyan-700">
              <span className="text-lg leading-none">💡</span>
              <div>
                <strong className="block mb-0.5">Stop Mencuci Sendiri</strong>
                <p className="text-slate-500 text-[11px]">Maksimalkan waktu berharga Anda, biarkan Smart Laundry System kami yang mencuci untuk Anda!</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CekStatus;