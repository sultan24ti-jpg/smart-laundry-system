import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { validateEmail, validatePhone } from '../../utils/helpers';

const RegisterForm = () => {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    nohp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.email) newErrors.email = 'Email wajib diisi';
    else if (!validateEmail(formData.email)) newErrors.email = 'Format email tidak valid';
    if (formData.nohp && !validatePhone(formData.nohp)) newErrors.nohp = 'Format nomor HP tidak valid';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    else if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Konfirmasi password tidak sama';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    let result;
    try {
      result = await register(formData);
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Gagal terhubung ke server');
      return;
    }
    setLoading(false);

    if (result.success) {
      toast.success('Pendaftaran berhasil! Silakan masuk.');
      navigate('/login');
    } else {
      toast.error(result.error);
      if (result.error.includes('Email')) {
        setErrors({ email: result.error });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🧺 Smart Laundry</h1>
          <p>Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <div className="form-input-wrapper">
              <FiUser className="form-input-icon" />
              <input
                type="text"
                name="nama"
                className={`form-input ${errors.nama ? 'error' : ''}`}
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>
            {errors.nama && <span className="form-error">{errors.nama}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="form-input-wrapper">
              <FiMail className="form-input-icon" />
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Nomor HP (Opsional)</label>
            <div className="form-input-wrapper">
              <FiPhone className="form-input-icon" />
              <input
                type="tel"
                name="nohp"
                className={`form-input ${errors.nohp ? 'error' : ''}`}
                placeholder="08xxxxxxxxxx"
                value={formData.nohp}
                onChange={handleChange}
              />
            </div>
            {errors.nohp && <span className="form-error">{errors.nohp}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <FiLock className="form-input-icon" />
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Konfirmasi Password</label>
            <div className="form-input-wrapper">
              <FiLock className="form-input-icon" />
              <input
                type="password"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Memproses...' : (<><FiUserPlus /> Daftar</>)}
          </button>
        </form>

        <div className="auth-footer">
          <p>Sudah punya akun? <Link to="/login">Masuk</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
