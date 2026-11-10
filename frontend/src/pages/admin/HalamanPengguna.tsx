import React, { useState, useEffect } from 'react';
import PenggunaApi from '../../api/Pengguna';
import type { UserProfile } from '../../models/Akun';
import { Mail, Phone } from 'lucide-react';

export const HalamanPengguna: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const res = await PenggunaApi.getAllUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.35rem' }}>
          Manajemen Pengguna Terdaftar
        </h1>
        <p style={{ color: '#5A6A76', fontSize: '0.9rem' }}>
          Daftar seluruh pengguna sistem Rentifa (Customer dan Administrator).
        </p>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5A6A76' }}>
            Memuat daftar pengguna...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5A6A76' }}>
            Belum ada pengguna.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Alamat Email</th>
                <th>Nomor WhatsApp</th>
                <th>Kota</th>
                <th>Role Akses</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong style={{ color: '#081D2C' }}>{u.full_name || 'Tanpa Nama'}</strong>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5A6A76' }}>
                      <Mail size={14} /> {u.email}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#5A6A76' }}>
                      <Phone size={14} /> {u.phone_number || '-'}
                    </div>
                  </td>
                  <td>{u.city || 'Indonesia'}</td>
                  <td>
                    <span className={u.role === 'admin' ? 'badge badge-confirmed' : 'badge badge-pending'}>
                      {u.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HalamanPengguna;
