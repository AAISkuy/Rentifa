import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import KendaraanApi from '../api/Kendaraan';
import type { Vehicle, Category } from '../models/Kendaraan';
import { Users, Fuel, Settings2, ShieldCheck, Search, ChevronRight } from 'lucide-react';

export const HalamanBeranda: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedType = searchParams.get('type') || 'all';
  const [keyword, setKeyword] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [selectedType, selectedCategory]);

  const fetchCategories = async () => {
    const res = await KendaraanApi.getCategories();
    if (res.success && res.data) {
      setCategories(res.data);
    }
  };

  const fetchVehicles = async () => {
    setLoading(true);
    const params: any = {};
    if (selectedType !== 'all') params.type = selectedType;
    if (selectedCategory) params.category_id = selectedCategory;
    if (keyword) params.search = keyword;

    const res = await KendaraanApi.getCatalog(params);
    if (res.success && res.data) {
      setVehicles(res.data);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles();
  };

  const formatRupiah = (val: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        backgroundColor: '#002724',
        color: '#FFFFFF',
        padding: '3.5rem 0 5rem 0',
        position: 'relative',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <span style={{
            backgroundColor: '#075E54',
            color: '#A5EDE0',
            padding: '0.3rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '1rem',
          }}>
            <ShieldCheck size={16} /> Layanan Rental Terpercaya di Indonesia
          </span>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Reliable Rides, Easy Rentals.
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: '#C8DCF0',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}>
            Sewa mobil dan motor untuk kebutuhan liburan, bisnis, atau harian dengan unit bersih, prima, dan tarif transparan.
          </p>

          {/* Floating Search Capsule */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
              color: '#081D2C',
              flexWrap: 'wrap',
            }}
          >
            {/* Type selector */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => { setSearchParams({}); setSelectedCategory(null); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  backgroundColor: selectedType === 'all' ? 'var(--primary)' : '#F1F4F7',
                  color: selectedType === 'all' ? '#FFFFFF' : '#5A6A76',
                }}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => { setSearchParams({ type: 'car' }); setSelectedCategory(null); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  backgroundColor: selectedType === 'car' ? 'var(--primary)' : '#F1F4F7',
                  color: selectedType === 'car' ? '#FFFFFF' : '#5A6A76',
                }}
              >
                Mobil
              </button>
              <button
                type="button"
                onClick={() => { setSearchParams({ type: 'motorcycle' }); setSelectedCategory(null); }}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  backgroundColor: selectedType === 'motorcycle' ? 'var(--primary)' : '#F1F4F7',
                  color: selectedType === 'motorcycle' ? '#FFFFFF' : '#5A6A76',
                }}
              >
                Motor
              </button>
            </div>

            {/* Keyword Input */}
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search
                size={18}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8E9FAA' }}
              />
              <input
                type="text"
                placeholder="Cari merk atau model (contoh: Avanza, Brio, NMAX)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.4rem',
                  borderRadius: '8px',
                  border: '1px solid #E2E8EC',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
              Cari Unit
            </button>
          </form>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1.5rem' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: selectedCategory === null ? '#075E54' : '#FFFFFF',
              color: selectedCategory === null ? '#FFFFFF' : '#5A6A76',
              border: '1px solid #E2E8EC',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Semua Kategori
          </button>
          {categories
            .filter((c) => selectedType === 'all' || c.type === selectedType)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.45rem 1.1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: selectedCategory === cat.id ? '#075E54' : '#FFFFFF',
                  color: selectedCategory === cat.id ? '#FFFFFF' : '#5A6A76',
                  border: '1px solid #E2E8EC',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name}
              </button>
            ))}
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#081D2C' }}>
              Pilihan Armada Siap Pakai
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#5A6A76' }}>
              Tersedia {vehicles.length} kendaraan bergaransi bersih dan terawat.
            </p>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#5A6A76' }}>
            Memuat katalog armada...
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#5A6A76' }}>
            Tidak ada kendaraan yang sesuai dengan filter pencarian.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {vehicles.map((v) => (
              <div
                key={v.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8EC',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 6px rgba(23, 43, 58, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Vehicle Image */}
                <div style={{ height: '190px', position: 'relative', backgroundColor: '#F7F9FA' }}>
                  <img
                    src={v.primary_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                    alt={`${v.brand} ${v.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(0, 39, 36, 0.85)',
                    color: '#FFFFFF',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {v.category_name}
                  </span>
                </div>

                {/* Vehicle Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#081D2C', marginBottom: '0.35rem' }}>
                    {v.brand} {v.model}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#5A6A76', marginBottom: '1rem' }}>
                    Tahun {v.year} • Plat: {v.license_plate}
                  </div>

                  {/* Spec Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem 0',
                    borderTop: '1px solid #F1F4F7',
                    borderBottom: '1px solid #F1F4F7',
                    marginBottom: '1rem',
                    fontSize: '0.825rem',
                    color: '#5A6A76',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={16} />
                      <span>{v.seating_capacity} Kursi</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Settings2 size={16} />
                      <span style={{ textTransform: 'capitalize' }}>{v.transmission}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Fuel size={16} />
                      <span style={{ textTransform: 'capitalize' }}>{v.fuel_type}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#5A6A76', display: 'block' }}>Mulai dari</span>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                        {formatRupiah(v.daily_rate)}
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#5A6A76' }}> /hari</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/vehicles/${v.id}`)}
                      className="btn-primary"
                      style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                    >
                      Detail & Sewa <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#002724',
        color: '#C8DCF0',
        padding: '3rem 0 2rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Rentifa
            </h4>
            <p style={{ maxWidth: '350px', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Platform persewaan kendaraan digital modern untuk kemudahan mobilitas harian, wisata, dan operasional bisnis di Indonesia.
            </p>
          </div>
          <div>
            <h5 style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: '0.75rem' }}>Kontak & Layanan</h5>
            <p style={{ fontSize: '0.875rem' }}>WhatsApp Customer Care: 0812-3456-7890</p>
            <p style={{ fontSize: '0.875rem' }}>Email: support@rentifa.com</p>
          </div>
        </div>
        <div className="container" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.8rem', textAlign: 'center' }}>
          © {new Date().getFullYear()} Rentifa Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HalamanBeranda;
