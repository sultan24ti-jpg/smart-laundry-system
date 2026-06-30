import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

const LoginForm = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email wajib diisi';
    if (!formData.password) newErrors.password = 'Password wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    let result;
    try {
      result = await login(formData);
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Gagal terhubung ke server');
      return;
    }
    setLoading(false);

    if (result.success) {
      toast.success(`Selamat datang, ${result.user.nama}!`);
      if (result.user.role === 'pelanggan') {
        navigate('/cek-status');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(result.error);
      setErrors({ password: result.error });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🧺 Smart Laundry</h1>
          <p>Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Password</label>
            <div className="form-input-wrapper">
              <FiLock className="form-input-icon" />
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Memproses...' : (<><FiLogIn /> Masuk</>)}
          </button>
        </form>

        <div className="auth-footer">
          <p>Belum punya akun? <Link to="/register">Daftar di sini</Link></p>
          <p style={{ marginTop: '10px' }}>
            Demo: owner@laundry.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
