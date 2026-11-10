import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';

export const HalamanRegister: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await register({
      email,
      password,
      full_name: fullName,
      phone_number: phoneNumber,
    });
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message || 'Registrasi gagal.');
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
        maxWidth: '460px',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8EC',
        padding: '2.5rem',
        boxShadow: '0 8px 24px rgba(0, 63, 58, 0.06)',
      }}>
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#081D2C' }}>Buat Akun Baru</h2>
          <p style={{ fontSize: '0.875rem', color: '#5A6A76' }}>
            Daftar untuk mulai reservasi mobil & motor dengan mudah
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
            <label className="form-label">Nama Lengkap Sesuai KTP</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Budi Santoso"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="email"
                className="form-control"
                placeholder="budi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nomor WhatsApp / HP</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="tel"
                className="form-control"
                placeholder="08123456789"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kata Sandi (Minimal 6 Karakter)</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                minLength={6}
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
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#5A6A76' }}>
          Sudah memiliki akun?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HalamanRegister;
