import React, { useState, useEffect } from 'react';
import KendaraanApi from '../../api/Kendaraan';
import { CalendarCheck, DollarSign, Clock, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react';

export const Beranda: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const res = await KendaraanApi.getDashboardStats();
    if (res.success && res.data) {
      setStats(res.data);
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

  if (loading) {
    return <div style={{ color: '#5A6A76' }}>Memuat ringkasan performa bisnis...</div>;
  }

  const counts = stats?.counts || {};
  const revenue = stats?.revenue || {};
  const paymentBreakdown = stats?.paymentBreakdown || [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.35rem' }}>
          Ringkasan & Finansial
        </h1>
        <p style={{ color: '#5A6A76', fontSize: '0.9rem' }}>
          Pantau status pemesanan terkini dan performa pendapatan rental kendaraan.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Reservasi</h4>
            <div className="stat-value">{counts.total || 0}</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#E6F5EF', color: '#075E54' }}>
            <CalendarCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Perlu Verifikasi</h4>
            <div className="stat-value" style={{ color: '#D97706' }}>
              {counts.pending_confirmation || 0}
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Sedang Berjalan / Aktif</h4>
            <div className="stat-value" style={{ color: '#2563EB' }}>
              {counts.active_rental || 0}
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Pendapatan Bulan Ini (MTD)</h4>
            <div className="stat-value" style={{ fontSize: '1.35rem', color: '#075E54' }}>
              {formatRupiah(revenue.mtd_revenue || 0)}
            </div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: '#E6F5EF', color: '#075E54' }}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Revenue & Payment Methods Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Total Financial Summary */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={20} color="var(--primary)" /> Ringkasan Pembayaran & Kas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: '#F7F9FA',
              borderRadius: '8px',
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#5A6A76', display: 'block' }}>Total Akumulasi Pendapatan Bersih</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatRupiah(revenue.total_revenue || 0)}
                </span>
              </div>
              <span className="badge badge-confirmed">Terverifikasi Lunas</span>
            </div>

            <div style={{ fontSize: '0.875rem', color: '#5A6A76', lineHeight: 1.6 }}>
              Penerimaan pembayaran diproses secara otomatis via Virtual Account & QRIS terintegrasi sistem. Seluruh dana jaminan (security deposit) dialokasikan dalam pos penahanan terpisah sampai serah terima selesai.
            </div>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="var(--primary)" /> Kanal Pembayaran Terpakai
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {paymentBreakdown.length === 0 ? (
              <div style={{ color: '#5A6A76', fontSize: '0.875rem' }}>Belum ada data transaksi.</div>
            ) : (
              paymentBreakdown.map((p: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    border: '1px solid #E2E8EC',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#081D2C' }}>{p.payment_method || 'Virtual Account'}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#5A6A76' }}>{p.count} Transaksi</div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#075E54', fontSize: '0.95rem' }}>
                    {formatRupiah(p.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beranda;
