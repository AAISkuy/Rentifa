import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, CalendarCheck, CarFront, Users, LogOut, ArrowLeft } from 'lucide-react';

export const SideBar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <CarFront size={28} color="#A5EDE0" />
        <div>
          <div className="admin-sidebar-logo">Rentifa</div>
        </div>
        <span className="admin-sidebar-badge">ADMIN</span>
      </div>

      <nav className="admin-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          Ringkasan & Finansial
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <CalendarCheck size={20} />
          Manajemen Booking
        </NavLink>

        <NavLink
          to="/admin/vehicles"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <CarFront size={20} />
          Armada Kendaraan
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={20} />
          Manajemen Pengguna
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#C8DCF0',
            fontSize: '0.85rem',
            marginBottom: '0.75rem',
          }}
        >
          <ArrowLeft size={16} /> Ke Halaman Utama
        </Link>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#FFDAD6',
            fontSize: '0.85rem',
            width: '100%',
          }}
        >
          <LogOut size={16} /> Keluar Akun
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
