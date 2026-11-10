import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import KendaraanApi from '../api/Kendaraan';
import type { Booking } from '../models/Kendaraan';
import { Search, CheckCircle2, Clock, XCircle, Car, CreditCard } from 'lucide-react';

export const HalamanTracking: React.FC = () => {
  const { code } = useParams<{ code?: string }>();
  const [inputCode, setInputCode] = useState<string>(code || '');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      loadBooking(code);
    }
  }, [code]);

  const loadBooking = async (searchCode: string) => {
    if (!searchCode.trim()) return;
    setLoading(true);
    setErrorMsg('');
    const res = await KendaraanApi.getBookingByCode(searchCode.trim());
    if (res.success && res.data) {
      setBooking(res.data);
    } else {
      setBooking(null);
      setErrorMsg(res.message || 'Nomor booking tidak ditemukan.');
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      navigate(`/tracking/${inputCode.trim()}`);
    }
  };

  const formatRupiah = (val: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_confirmation':
        return <span className="badge badge-pending"><Clock size={14} /> Menunggu Verifikasi Admin</span>;
      case 'confirmed':
        return <span className="badge badge-confirmed"><CheckCircle2 size={14} /> Reservasi Disetujui</span>;
      case 'active_rental':
        return <span className="badge badge-active"><Car size={14} /> Sedang Disewa</span>;
      case 'completed':
        return <span className="badge badge-confirmed"><CheckCircle2 size={14} /> Sewa Selesai</span>;
      case 'rejected':
        return <span className="badge badge-rejected"><XCircle size={14} /> Pengajuan Ditolak</span>;
      case 'cancelled':
        return <span className="badge badge-cancelled"><XCircle size={14} /> Dibatalkan</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getTimelineStep = (status: string) => {
    if (status === 'pending_confirmation') return 1;
    if (status === 'confirmed') return 2;
    if (status === 'active_rental' || status === 'completed') return 3;
    return 0;
  };

  const currentStep = booking ? getTimelineStep(booking.booking_status) : 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ padding: '3rem 1.5rem', maxWidth: '850px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.5rem' }}>
            Pelacakan Status Booking
          </h1>
          <p style={{ color: '#5A6A76', fontSize: '0.95rem' }}>
            Cek progres verifikasi berkas, konfirmasi ketersediaan unit, dan status pembayaran Anda.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            style={{
              display: 'flex',
              maxWidth: '500px',
              margin: '1.5rem auto 0 auto',
              gap: '0.5rem',
            }}
          >
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Masukkan Kode Booking (Contoh: BK-20261109-001)..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Cek Status
            </button>
          </form>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#5A6A76' }}>
            Memeriksa data reservasi...
          </div>
        )}

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger-text)',
            padding: '1rem',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '2rem',
          }}>
            {errorMsg}
          </div>
        )}

        {booking && (
          <div>
            {/* Success Banner & Code */}
            <div style={{
              backgroundColor: '#E6F5EF',
              border: '1px solid #A5EDE0',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#075E54', fontWeight: 600, textTransform: 'uppercase' }}>
                  Nomor Referensi Booking
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  #{booking.booking_code}
                </div>
              </div>
              <div>{getStatusBadge(booking.booking_status)}</div>
            </div>

            {/* Timeline Progress */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Alur Tahapan Sewa
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Step 1 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= 1 ? '#075E54' : '#E2E8EC',
                    color: currentStep >= 1 ? '#FFFFFF' : '#8E9FAA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontWeight: 700,
                  }}>
                    1
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#081D2C' }}>
                    Persetujuan Admin
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#5A6A76' }}>Verifikasi data</div>
                </div>

                {/* Step 2 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= 2 ? '#075E54' : '#E2E8EC',
                    color: currentStep >= 2 ? '#FFFFFF' : '#8E9FAA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontWeight: 700,
                  }}>
                    2
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#081D2C' }}>
                    Pembayaran
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#5A6A76' }}>{booking.payment_status === 'paid' ? 'Lunas' : 'Menunggu / VA'}</div>
                </div>

                {/* Step 3 */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: currentStep >= 3 ? '#075E54' : '#E2E8EC',
                    color: currentStep >= 3 ? '#FFFFFF' : '#8E9FAA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.5rem auto',
                    fontWeight: 700,
                  }}>
                    3
                  </div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#081D2C' }}>
                    Serah Terima Armada
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#5A6A76' }}>Check-in & Jalan</div>
                </div>
              </div>
            </div>

            {/* Details Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Unit Info */}
              <div className="card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Car size={18} color="var(--primary)" /> Informasi Kendaraan
                </h4>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                  {booking.vehicle_image && (
                    <img
                      src={booking.vehicle_image}
                      alt=""
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#081D2C' }}>
                      {booking.vehicle_brand} {booking.vehicle_model}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#5A6A76' }}>
                      Plat: {booking.vehicle_license_plate}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#5A6A76', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div><strong>Mulai:</strong> {booking.start_date}</div>
                  <div><strong>Selesai:</strong> {booking.end_date} ({booking.duration_days} hari)</div>
                </div>
              </div>

              {/* Payment & Renter Info */}
              <div className="card">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={18} color="var(--primary)" /> Rincian Pembayaran
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#5A6A76' }}>Penyewa:</span>
                    <span style={{ fontWeight: 600 }}>{booking.customer_name || booking.customer_email}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#5A6A76' }}>Metode:</span>
                    <span style={{ fontWeight: 600 }}>{booking.payment_method || 'Virtual Account'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#5A6A76' }}>Status Bayar:</span>
                    <span className={booking.payment_status === 'paid' ? 'badge badge-confirmed' : 'badge badge-pending'}>
                      {booking.payment_status === 'paid' ? 'Sudah Terbayar' : 'Menunggu Bayar'}
                    </span>
                  </div>
                  <div style={{
                    borderTop: '1px solid #F1F4F7',
                    paddingTop: '0.5rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'var(--primary)',
                  }}>
                    <span>Total Pembayaran:</span>
                    <span>{formatRupiah(booking.grand_total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HalamanTracking;
