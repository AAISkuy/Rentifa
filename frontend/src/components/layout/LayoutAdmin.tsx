import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SideBar from './SideBar';
import '../../css/Admin.css';

export const LayoutAdmin: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-wrapper">
      <SideBar />
      <div className="admin-content-area">
        <header className="admin-header">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#081D2C' }}>
            Panel Pengelola Rental
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#081D2C' }}>
              {user?.full_name || user?.email}
            </span>
            <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
              Admin
            </span>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutAdmin;
