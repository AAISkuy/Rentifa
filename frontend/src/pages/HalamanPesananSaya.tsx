import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import KendaraanApi from '../api/Kendaraan';
import type { Booking } from '../models/Kendaraan';
import { useAuth } from '../context/AuthContext';
import { ChevronRight } from 'lucide-react';

export const HalamanPesananSaya: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    setLoading(true);
    const res = await KendaraanApi.getMyBookings();
    if (res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  const formatRupiah = (val: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  const renderBadge = (status: string) => {
    switch (status) {
      case 'pending_confirmation':
        return <span className="badge badge-pending">Menunggu Verifikasi</span>;
      case 'confirmed':
        return <span className="badge badge-confirmed">Disetujui</span>;
      case 'active_rental':
        return <span className="badge badge-active">Sedang Disewa</span>;
      case 'completed':
        return <span className="badge badge-confirmed">Selesai</span>;
      default:
        return <span className="badge badge-rejected">Dibatalkan / Tolak</span>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ padding: '3rem 1.5rem', maxWidth: '900px', flex: 1 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.5rem' }}>
          Riwayat & Pesanan Saya
        </h1>
        <p style={{ color: '#5A6A76', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Daftar seluruh riwayat penyewaan kendaraan Anda di Rentifa.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#5A6A76' }}>
            Memuat daftar pesanan...
          </div>
        ) : bookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: '#5A6A76', marginBottom: '1.5rem' }}>Anda belum memiliki riwayat pemesanan rental.</p>
            <Link to="/" className="btn-primary">
              Cari & Sewa Kendaraan Sekarang
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {b.vehicle_image && (
                    <img
                      src={b.vehicle_image}
                      alt=""
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                      #{b.booking_code}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#081D2C' }}>
                      {b.vehicle_brand} {b.vehicle_model}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#5A6A76' }}>
                      {b.start_date} s/d {b.end_date} ({b.duration_days} hari)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '0.35rem' }}>{renderBadge(b.booking_status)}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatRupiah(b.grand_total)}
                    </div>
                  </div>

                  <Link
                    to={`/tracking/${b.booking_code}`}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                  >
                    Detail & Status <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HalamanPesananSaya;
