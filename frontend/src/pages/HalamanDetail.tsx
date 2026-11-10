import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import KendaraanApi from '../api/Kendaraan';
import type { Vehicle } from '../models/Kendaraan';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowLeft, AlertCircle } from 'lucide-react';

export const HalamanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
  
  // Booking Calculator State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(tomorrow);
  const [paymentMethod, setPaymentMethod] = useState<string>('BCA Virtual Account');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDetail(Number(id));
    }
  }, [id]);

  const fetchDetail = async (vId: number) => {
    setLoading(true);
    const res = await KendaraanApi.getDetail(vId);
    if (res.success && res.data) {
      setVehicle(res.data);
      setActiveImage(res.data.primary_image || (res.data.images && res.data.images[0]?.image_url) || '');
    }
    setLoading(false);
  };

  const calculateDays = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = e.getTime() - s.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 1;
  };

  const days = calculateDays();
  const dailyRate = vehicle ? Number(vehicle.daily_rate) : 0;
  const subtotal = dailyRate * days;
  const deposit = vehicle ? Number(vehicle.security_deposit || 0) : 0;
  const grandTotal = subtotal + deposit;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!vehicle) return;

    setSubmitting(true);
    setErrorMsg('');

    const res = await KendaraanApi.createBooking({
      vehicle_id: vehicle.id,
      start_date: startDate,
      end_date: endDate,
      customer_notes: notes,
      payment_method: paymentMethod,
    });

    setSubmitting(false);

    if (res.success && res.data) {
      navigate(`/tracking/${res.data.booking_code}`);
    } else {
      setErrorMsg(res.message || 'Gagal mengajukan booking.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#5A6A76' }}>
          Memuat data armada...
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h3>Kendaraan tidak ditemukan.</h3>
          <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem', flex: 1 }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#5A6A76',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '2.5rem' }}>
          {/* Left Column: Photos, Overview, Specs, Policies */}
          <div>
            {/* Main Picture */}
            <div style={{
              height: '380px',
              backgroundColor: '#F1F4F7',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '1rem',
              border: '1px solid #E2E8EC',
            }}>
              <img
                src={activeImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                alt={`${vehicle.brand} ${vehicle.model}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Thumbnail gallery */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                {vehicle.images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    style={{
                      width: '80px',
                      height: '60px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: activeImage === img.image_url ? '2px solid var(--primary)' : '1px solid #E2E8EC',
                      cursor: 'pointer',
                    }}
                  >
                    <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-confirmed">Unit Tersedia</span>
              <span style={{ fontSize: '0.85rem', color: '#5A6A76' }}>
                Kategori: {vehicle.category_name}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.5rem' }}>
              {vehicle.brand} {vehicle.model}
            </h1>
            <p style={{ color: '#5A6A76', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {vehicle.description || 'Kendaraan sewa siap pakai dengan kondisi prima, AC dingin, dan kebersihan kabin terjaga.'}
            </p>

            {/* Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8EC',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E9FAA', display: 'block', marginBottom: '0.2rem' }}>Transmisi</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#081D2C' }}>
                  {vehicle.transmission}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E9FAA', display: 'block', marginBottom: '0.2rem' }}>Bahan Bakar</span>
                <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#081D2C' }}>
                  {vehicle.fuel_type}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E9FAA', display: 'block', marginBottom: '0.2rem' }}>Kapasitas</span>
                <span style={{ fontWeight: 600, color: '#081D2C' }}>
                  {vehicle.seating_capacity} Penumpang
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E9FAA', display: 'block', marginBottom: '0.2rem' }}>Tahun Unit</span>
                <span style={{ fontWeight: 600, color: '#081D2C' }}>
                  {vehicle.year}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E9FAA', display: 'block', marginBottom: '0.2rem' }}>Plat Nomor</span>
                <span style={{ fontWeight: 600, color: '#081D2C' }}>
                  {vehicle.license_plate}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#8E9FAA', display: 'block', marginBottom: '0.2rem' }}>Warna</span>
                <span style={{ fontWeight: 600, color: '#081D2C' }}>
                  {vehicle.color}
                </span>
              </div>
            </div>

            {/* Syarat & Kebijakan Sewa */}
            <div className="card">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="var(--primary)" /> Syarat & Ketentuan Sewa
              </h3>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#5A6A76', lineHeight: 1.8 }}>
                <li>Penyewa wajib menunjukkan e-KTP dan SIM aktif (SIM A untuk mobil, SIM C untuk motor).</li>
                <li>Deposit jaminan dikembalikan penuh setelah masa sewa berakhir dan unit dicek.</li>
                <li>Dilarang membawa muatan terlarang atau mengalihkan sewa ke pihak lain tanpa konfirmasi admin.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Real-time Booking Calculator */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '90px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #F1F4F7', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#5A6A76' }}>Tarif Sewa Harian</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {formatRupiah(dailyRate)}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#5A6A76' }}> /hari</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div style={{
                  backgroundColor: 'var(--danger-bg)',
                  color: 'var(--danger-text)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label className="form-label">Mulai Sewa (Tanggal & Waktu Ambil)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={startDate}
                    min={today}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Selesai Sewa (Tanggal Pengembalian)</label>
                  <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Metode Pembayaran Pilihan</label>
                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="BCA Virtual Account">BCA Virtual Account</option>
                    <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                    <option value="QRIS (Instant Pay)">QRIS (Instant Pay)</option>
                    <option value="Tunai saat Serah Terima">Tunai saat Serah Terima</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan Tambahan (Opsional)</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Contoh: Titik temu di Bandara Soetta T3..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Calculation Breakdown */}
                <div style={{
                  backgroundColor: '#F7F9FA',
                  borderRadius: '10px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5A6A76' }}>
                    <span>Durasi Sewa:</span>
                    <span style={{ fontWeight: 600, color: '#081D2C' }}>{days} Hari</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5A6A76' }}>
                    <span>Subtotal ({days} x {formatRupiah(dailyRate)}):</span>
                    <span style={{ fontWeight: 600, color: '#081D2C' }}>{formatRupiah(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5A6A76' }}>
                    <span>Deposit Jaminan (Refundable):</span>
                    <span style={{ fontWeight: 600, color: '#081D2C' }}>{formatRupiah(deposit)}</span>
                  </div>
                  <div style={{
                    borderTop: '1px dashed #E2E8EC',
                    paddingTop: '0.5rem',
                    marginTop: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                  }}>
                    <span>Total Estimasi:</span>
                    <span>{formatRupiah(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.85rem' }}
                >
                  {submitting ? 'Memproses Pengajuan...' : 'Ajukan Booking Sekarang'}
                </button>

                {!isAuthenticated && (
                  <p style={{ fontSize: '0.75rem', color: '#8E9FAA', textAlign: 'center', marginTop: '0.75rem' }}>
                    *Anda akan diminta masuk atau mendaftar terlebih dahulu.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HalamanDetail;
