import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, AlertCircle } from 'lucide-react';

export const HalamanLogin: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Check if user is admin
      const saved = localStorage.getItem('rentifa_user');
      const user = saved ? JSON.parse(saved) : null;
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      setErrorMsg(res.message || 'Login gagal. Periksa email dan password.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F7F9FA',
      padding: '2rem 1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8EC',
        padding: '2.5rem',
        boxShadow: '0 8px 24px rgba(0, 63, 58, 0.06)',
      }}>
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Car size={24} />
            </div>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>Rentifa</span>
          </Link>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#081D2C' }}>Masuk ke Akun Anda</h2>
          <p style={{ fontSize: '0.875rem', color: '#5A6A76' }}>
            Akses dashboard pemesanan dan armada sewa Anda
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger-text)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="email"
                className="form-control"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Memproses Masuk...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#5A6A76' }}>
          Belum memiliki akun?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HalamanLogin;
