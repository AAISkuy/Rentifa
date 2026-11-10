import React, { useState, useEffect } from 'react';
import KendaraanApi from '../../api/Kendaraan';
import type { Booking } from '../../models/Kendaraan';
import { Check, X, CheckCheck, RefreshCw } from 'lucide-react';

export const HalamanBooking: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    const res = await KendaraanApi.getAdminBookings(statusFilter);
    if (res.success && res.data) {
      setBookings(res.data);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    setActionLoading(id);
    const res = await KendaraanApi.updateBookingStatus(id, status, notes);
    setActionLoading(null);
    if (res.success) {
      loadBookings();
    } else {
      alert(res.message || 'Gagal memperbarui status');
    }
  };

  const formatRupiah = (val: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_confirmation':
        return <span className="badge badge-pending">Pending Review</span>;
      case 'confirmed':
        return <span className="badge badge-confirmed">Disetujui</span>;
      case 'active_rental':
        return <span className="badge badge-active">Sedang Berjalan</span>;
      case 'completed':
        return <span className="badge badge-confirmed">Selesai</span>;
      case 'rejected':
        return <span className="badge badge-rejected">Ditolak</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled">Dibatalkan</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.35rem' }}>
            Manajemen Booking & Sewa
          </h1>
          <p style={{ color: '#5A6A76', fontSize: '0.9rem' }}>
            Verifikasi pengajuan pelanggan dan kelola status armada rental.
          </p>
        </div>

        <button
          onClick={loadBookings}
          className="btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <RefreshCw size={16} /> Segarkan
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { key: 'all', label: 'Semua Booking' },
          { key: 'pending_confirmation', label: 'Perlu Verifikasi' },
          { key: 'confirmed', label: 'Disetujui' },
          { key: 'active_rental', label: 'Sedang Disewa' },
          { key: 'completed', label: 'Selesai' },
          { key: 'rejected', label: 'Ditolak' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: statusFilter === tab.key ? '#003F3A' : '#FFFFFF',
              color: statusFilter === tab.key ? '#FFFFFF' : '#5A6A76',
              border: '1px solid #E2E8EC',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5A6A76' }}>
            Memuat daftar pemesanan...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5A6A76' }}>
            Tidak ada reservasi yang ditemukan.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Pelanggan</th>
                <th>Armada Kendaraan</th>
                <th>Durasi & Jadwal</th>
                <th>Total Bayar</th>
                <th>Status</th>
                <th>Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: '#003F3A' }}>
                    #{b.booking_code}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.customer_name || 'Pelanggan'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#5A6A76' }}>{b.customer_phone || b.customer_email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.vehicle_brand} {b.vehicle_model}</div>
                    <div style={{ fontSize: '0.8rem', color: '#5A6A76' }}>{b.vehicle_license_plate}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{b.start_date} s/d {b.end_date}</div>
                    <div style={{ fontSize: '0.75rem', color: '#5A6A76' }}>{b.duration_days} Hari</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#081D2C' }}>{formatRupiah(b.grand_total)}</div>
                    <span className={b.payment_status === 'paid' ? 'badge badge-confirmed' : 'badge badge-pending'} style={{ fontSize: '0.7rem' }}>
                      {b.payment_status === 'paid' ? 'Lunas' : 'Pending'}
                    </span>
                  </td>
                  <td>{renderStatusBadge(b.booking_status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {b.booking_status === 'pending_confirmation' && (
                        <>
                          <button
                            disabled={actionLoading === b.id}
                            onClick={() => handleUpdateStatus(b.id, 'confirmed', 'Disetujui oleh admin')}
                            title="Setujui Booking"
                            style={{
                              backgroundColor: '#E6F5EF',
                              color: '#075E54',
                              border: '1px solid #A5EDE0',
                              borderRadius: '6px',
                              padding: '0.4rem 0.65rem',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Check size={14} /> Setujui
                          </button>
                          <button
                            disabled={actionLoading === b.id}
                            onClick={() => handleUpdateStatus(b.id, 'rejected', 'Ditolak oleh admin')}
                            title="Tolak Booking"
                            style={{
                              backgroundColor: '#FDF2F2',
                              color: '#DC3545',
                              border: '1px solid #FCDAD7',
                              borderRadius: '6px',
                              padding: '0.4rem 0.65rem',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <X size={14} /> Tolak
                          </button>
                        </>
                      )}

                      {b.booking_status === 'confirmed' && (
                        <button
                          disabled={actionLoading === b.id}
                          onClick={() => handleUpdateStatus(b.id, 'active_rental', 'Armada telah diserahterimakan')}
                          style={{
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #BFDBFE',
                            borderRadius: '6px',
                            padding: '0.4rem 0.65rem',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                          }}
                        >
                          Mulai Sewa
                        </button>
                      )}

                      {b.booking_status === 'active_rental' && (
                        <button
                          disabled={actionLoading === b.id}
                          onClick={() => handleUpdateStatus(b.id, 'completed', 'Unit telah dikembalikan dan selesai')}
                          style={{
                            backgroundColor: '#E6F5EF',
                            color: '#075E54',
                            border: '1px solid #A5EDE0',
                            borderRadius: '6px',
                            padding: '0.4rem 0.65rem',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <CheckCheck size={14} /> Selesaikan
                        </button>
                      )}
                    </div>
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

export default HalamanBooking;
