import React, { useState, useEffect } from 'react';
import KendaraanApi from '../../api/Kendaraan';
import type { Vehicle, Category } from '../../models/Kendaraan';
import FormKendaraan from '../../components/FormKendaraan';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const HalamanProduk: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [vRes, cRes] = await Promise.all([
      KendaraanApi.getAllForAdmin(),
      KendaraanApi.getCategories(),
    ]);

    if (vRes.success && vRes.data) {
      setVehicles(vRes.data);
    }
    if (cRes.success && cRes.data) {
      setCategories(cRes.data);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menonaktifkan unit kendaraan ini?')) {
      const res = await KendaraanApi.deleteVehicle(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.message || 'Gagal menghapus unit.');
      }
    }
  };

  const formatRupiah = (val: number | string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#081D2C', marginBottom: '0.35rem' }}>
            Manajemen Armada Kendaraan
          </h1>
          <p style={{ color: '#5A6A76', fontSize: '0.9rem' }}>
            Kelola data mobil dan motor rental, penentuan tarif harian, dan ketersediaan unit.
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn-primary">
          <Plus size={18} /> Tambah Kendaraan
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5A6A76' }}>
            Memuat daftar armada...
          </div>
        ) : vehicles.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5A6A76' }}>
            Belum ada armada yang terdaftar.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kendaraan</th>
                <th>Kategori</th>
                <th>Plat Nomor</th>
                <th>Transmisi / BBM</th>
                <th>Tarif Harian</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={v.primary_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80'}
                        alt=""
                        style={{ width: '50px', height: '38px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <strong style={{ color: '#081D2C' }}>{v.brand} {v.model}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#5A6A76' }}>Tahun {v.year}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ backgroundColor: '#F1F4F7', color: '#081D2C' }}>
                      {v.category_name}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{v.license_plate}</td>
                  <td>
                    <span style={{ textTransform: 'capitalize' }}>{v.transmission}</span> /{' '}
                    <span style={{ textTransform: 'capitalize', color: '#5A6A76' }}>{v.fuel_type}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {formatRupiah(v.daily_rate)}
                  </td>
                  <td>
                    <span className={v.status === 'available' ? 'badge badge-confirmed' : 'badge badge-pending'}>
                      {v.status === 'available' ? 'Tersedia' : v.status === 'maintenance' ? 'Perawatan' : 'Nonaktif'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => handleOpenEdit(v)}
                        title="Edit Armada"
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #E2E8EC',
                          backgroundColor: '#FFFFFF',
                          color: '#081D2C',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        title="Hapus / Nonaktifkan"
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #FFDAD6',
                          backgroundColor: '#FFF2F2',
                          color: '#BA1A1A',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <FormKendaraan
          categories={categories}
          initialData={editingVehicle}
          onClose={() => setModalOpen(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};

export default HalamanProduk;
