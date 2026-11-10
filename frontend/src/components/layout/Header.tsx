import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Search, User, LogOut, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8EC',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Car size={22} />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
              Rentifa
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
          <Link to="/" style={{ fontWeight: 600, color: '#081D2C', fontSize: '0.95rem' }}>
            Beranda
          </Link>
          <Link to="/?type=car" style={{ fontWeight: 500, color: '#5A6A76', fontSize: '0.95rem' }}>
            Mobil
          </Link>
          <Link to="/?type=motorcycle" style={{ fontWeight: 500, color: '#5A6A76', fontSize: '0.95rem' }}>
            Motor
          </Link>
          <Link to="/tracking" style={{
            fontWeight: 500,
            color: '#5A6A76',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            <Search size={16} /> Lacak Booking
          </Link>
          {isAuthenticated && (
            <Link to="/my-bookings" style={{ fontWeight: 500, color: '#5A6A76', fontSize: '0.95rem' }}>
              Pesanan Saya
            </Link>
          )}
        </nav>

        {/* User Auth actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAdmin && (
            <Link to="/admin" className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              <Shield size={16} /> Dashboard Admin
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}>
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={18} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#081D2C' }}>
                    {user?.full_name || user?.email}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#5A6A76', textTransform: 'capitalize' }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Keluar"
                style={{
                  padding: '0.45rem',
                  borderRadius: '6px',
                  color: '#5A6A76',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.92rem' }}>
                Masuk
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.88rem' }}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
