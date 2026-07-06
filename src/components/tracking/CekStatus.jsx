import React, { useState, useEffect } from 'react';
import { FiSearch, FiPackage, FiClock, FiUser, FiDollarSign, FiShield, FiTruck, FiStar } from 'react-icons/fi';
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
    <div className="relative font-sans">

      {/* SECTION 1: HERO & TRACKING INPUT — full-bleed, breaks out of the page padding */}
      <div className="relative -mx-6 -mt-6 md:-mx-8 md:-mt-8 overflow-hidden bg-gradient-to-br from-[#0B1730] via-[#17255A] to-[#4A1350] pt-20 pb-24 px-4">
        {/* decorative blobs & glow */}
        <div className="blob w-[420px] h-[420px] bg-sky-500/30 -top-32 -left-20" />
        <div className="blob w-[380px] h-[380px] bg-pink-500/25 -bottom-40 -right-10" style={{ animationDelay: '-4s' }} />
        <div className="blob w-[260px] h-[260px] bg-indigo-400/25 top-10 right-1/3" style={{ animationDelay: '-2s' }} />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 rise-in">
          <span className="badge badge-lg glass border-none gap-2 px-4 py-3 text-xs font-bold tracking-widest text-white uppercase mb-5 shadow-lg shadow-black/10">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400 pulse-dot" />
            Layanan Laundry Digital
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-white">
            Lacak Cucianmu, <span className="text-shimmer">Realtime.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300/90 max-w-lg mx-auto mb-10">
            Masukkan kode nota belanja Anda di bawah ini untuk melihat status pengerjaan pakaian secara langsung, kapan saja, di mana saja.
          </p>

          {/* Form Pencarian — glass search bar */}
          <div className="max-w-xl mx-auto glass rounded-2xl p-2 glow-ring-strong">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-sky-600" />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition text-slate-800 font-medium placeholder-slate-400 text-sm"
                  placeholder="Masukkan nomor nota Anda..."
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="btn border-none px-7 py-3.5 bg-gradient-to-r from-[#2563EB] via-indigo-500 to-pink-500 hover:brightness-110 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm shrink-0 normal-case"
              >
                <FiSearch className="h-4 w-4" /> Cek Status Cucian
              </button>
            </form>
          </div>

          {/* trust row */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-300/85 text-xs font-semibold">
            <span className="inline-flex items-center gap-2"><FiShield className="text-sky-300" /> Data aman &amp; privat</span>
            <span className="inline-flex items-center gap-2"><FiTruck className="text-pink-300" /> Estimasi selesai jelas</span>
            <span className="inline-flex items-center gap-2"><FiStar className="text-amber-300" /> Dipercaya 9+ tahun</span>
          </div>
        </div>

        {/* wave divider into the page body */}
        <svg className="absolute bottom-0 left-0 w-full text-[#F4F8FF]" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: '48px' }}>
          <path fill="currentColor" d="M0,32 C240,80 480,0 720,16 C960,32 1200,80 1440,32 L1440,80 L0,80 Z" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14 space-y-20 relative">
        {/* soft ambient blobs for the rest of the page */}
        <div className="blob w-72 h-72 bg-sky-300/25 top-10 -left-24" style={{ animationDelay: '-6s' }} />
        <div className="blob w-72 h-72 bg-pink-300/25 bottom-0 -right-24" style={{ animationDelay: '-3s' }} />

        {/* SECTION 2: TRACKING RESULT */}
        {searched && result && (
          <div className="relative z-10 glass rounded-3xl glow-ring overflow-hidden max-w-4xl mx-auto rise-in">
            <div className="bg-gradient-to-r from-[#2563EB] via-indigo-500 to-pink-500 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-100/90">Nomor Registrasi</span>
                <h2 className="text-xl font-black tracking-wide">{result.kode}</h2>
              </div>
              <span className={`badge badge-lg border-none px-4 py-3 text-xs font-extrabold uppercase tracking-wider bg-white shadow-sm ${getStatusBadgeClass(result.status)}`}>
                {STATUS_LABELS[result.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/50 bg-white/30">
              <div className="p-5 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-600 shrink-0"><FiUser size={16} /></span>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Pelanggan</p>
                  <p className="text-sm font-bold text-slate-800">{result.pelangganNama}</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/50">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0"><FiClock size={16} /></span>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Estimasi Selesai</p>
                  <p className="text-sm font-bold text-slate-800">{formatDateTime(result.estimasiSelesai)}</p>
                </div>
              </div>
              <div className="p-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shrink-0"><FiDollarSign size={16} /></span>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Total Pembayaran</p>
                  <p className="text-sm font-black text-emerald-600">{formatCurrency(result.total)}</p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3">🧺 Detail Keranjang</h4>
                <div className="space-y-2">
                  {result.items.map((it, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-white/60 rounded-xl text-xs border border-white/70">
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
                      <div className={`absolute -left-[14px] top-1 w-2 h-2 rounded-full border bg-white ${i === 0 ? 'border-sky-500 ring-4 ring-sky-100' : 'border-slate-300'}`} />
                      <p className={`font-bold ${i === 0 ? 'text-sky-600' : 'text-slate-600'}`}>{STATUS_LABELS[h.status]}</p>
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
          <div className="relative z-10 space-y-8 text-center">
            <div>
              <span className="text-xs font-bold text-pink-500 tracking-widest uppercase block mb-2">Pilihan Layanan</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
                Semua Kebutuhan <span className="bg-gradient-to-r from-sky-600 to-pink-500 bg-clip-text text-transparent">Laundry-mu</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
              {layanan.map((l) => (
                <div
                  key={l.id}
                  className="hover-float group relative flex min-h-[240px] flex-col items-center justify-between rounded-3xl border border-white/70 bg-gradient-to-br from-white via-sky-50/80 to-pink-50/80 p-6 text-center shadow-lg shadow-indigo-200/40 hover:shadow-2xl hover:shadow-pink-300/40 hover:border-pink-200"
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400/0 via-indigo-400/0 to-pink-400/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/70 shadow-inner mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2">
                    <img
                      src={getServiceIconPath(l.nama)}
                      alt={l.nama}
                      className="max-w-[80%] max-h-[80%] object-contain drop-shadow-sm"
                      onError={(e) => { e.target.src = '/images/default-service.png'; }}
                    />
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight group-hover:text-pink-600 transition-colors">
                      {l.nama}
                    </h4>
                    <p className="text-[11px] text-sky-600 font-bold mt-1">
                      {formatCurrency(l.harga)} <span className="text-slate-400 font-semibold">/ {l.satuan}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: ABOUT COMPANY */}
        <div className="relative z-10 glass rounded-[2rem] p-6 sm:p-10 glow-ring max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="relative w-full md:w-2/5 aspect-[4/3] sm:aspect-square shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] shadow-2xl shadow-indigo-300/50 ring-1 ring-white/70">
              <img
                src="/images/laundry-outlet.jpg"
                alt="Outlet Smart Laundry System"
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Smart+Laundry'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17255A]/50 via-pink-500/10 to-sky-400/10 mix-blend-multiply" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[1.75rem]" />
            </div>

            <div className="absolute -bottom-6 -right-6 z-20 flex h-28 w-28 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-full glass glow-ring-strong">
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-br from-pink-500 to-indigo-600 bg-clip-text text-transparent leading-none">9+</span>
              <span className="mt-1 max-w-[80px] text-center text-[9px] font-bold uppercase tracking-tight text-slate-600">
                Tahun<br />Pengalaman
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 text-left pt-6 md:pt-0">
            <span className="text-xs font-bold text-pink-500 tracking-widest uppercase block">Tentang Kami</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-snug font-display">
              Laundry Bersih, Wangi, Higienis, dan Tepat Waktu
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong className="text-sky-600">SMART LAUNDRY SYSTEM</strong> adalah layanan laundry kiloan dan satuan. Kami adalah tim profesional yang selalu mengutamakan kualitas cucian &amp; pelayanan dengan prinsip bersih, rapi, wangi, higienis &amp; tepat waktu.
              </p>
              <p>
                <strong className="text-sky-600">SMART LAUNDRY SYSTEM</strong> menerima laundry kiloan untuk perusahaan, misal kantor, rumah sakit, asrama, pesantren, sekolah, perusahaan konveksi atau perusahaan-perusahaan semisal, silakan hubungi kami.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-pink-100 bg-gradient-to-r from-pink-50/90 to-sky-50/90 p-4 text-xs text-pink-700 shadow-sm">
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
