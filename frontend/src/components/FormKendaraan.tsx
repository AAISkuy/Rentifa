import React, { useState } from 'react';
import KendaraanApi from '../api/Kendaraan';
import type { Category, Vehicle } from '../models/Kendaraan';
import { X } from 'lucide-react';

interface FormKendaraanProps {
  categories: Category[];
  initialData?: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const FormKendaraan: React.FC<FormKendaraanProps> = ({
  categories,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [categoryId, setCategoryId] = useState<number>(initialData?.category_id || categories[0]?.id || 1);
  const [licensePlate, setLicensePlate] = useState<string>(initialData?.license_plate || '');
  const [brand, setBrand] = useState<string>(initialData?.brand || '');
  const [model, setModel] = useState<string>(initialData?.model || '');
  const [year, setYear] = useState<number>(initialData?.year || new Date().getFullYear());
  const [color, setColor] = useState<string>(initialData?.color || 'Hitam');
  const [transmission, setTransmission] = useState<'manual' | 'automatic'>(initialData?.transmission || 'automatic');
  const [fuelType, setFuelType] = useState<string>(initialData?.fuel_type || 'gasoline');
  const [seatingCapacity, setSeatingCapacity] = useState<number>(initialData?.seating_capacity || 5);
  const [dailyRate, setDailyRate] = useState<number | string>(initialData?.daily_rate || '');
  const [securityDeposit, setSecurityDeposit] = useState<number | string>(initialData?.security_deposit || '');
  const [imageUrl, setImageUrl] = useState<string>(initialData?.primary_image || '');
  const [description, setDescription] = useState<string>(initialData?.description || '');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const payload = {
      category_id: categoryId,
      license_plate: licensePlate,
      brand,
      model,
      year: Number(year),
      color,
      transmission,
      fuel_type: fuelType,
      seating_capacity: Number(seatingCapacity),
      daily_rate: Number(dailyRate),
      security_deposit: Number(securityDeposit) || 0,
      image_url: imageUrl,
      description,
    };

    let res;
    if (initialData?.id) {
      res = await KendaraanApi.updateVehicle(initialData.id, payload);
    } else {
      res = await KendaraanApi.createVehicle(payload);
    }

    setLoading(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.message || 'Gagal menyimpan unit armada.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8, 29, 44, 0.5)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2rem',
        boxShadow: '0 16px 36px rgba(0, 31, 29, 0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8EC', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#081D2C' }}>
            {initialData ? 'Perbarui Data Armada' : 'Tambah Armada Baru'}
          </h2>
          <button onClick={onClose} style={{ color: '#5A6A76', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger-text)',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Merk (Brand)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Toyota, Honda"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Model Kendaraan</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: Avanza, Brio, NMAX"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-control"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Plat Nomor</label>
              <input
                type="text"
                className="form-control"
                placeholder="Contoh: B 1234 RNT"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tahun</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Warna Unit</label>
              <input
                type="text"
                className="form-control"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kapasitas Kursi</label>
              <input
                type="number"
                className="form-control"
                value={seatingCapacity}
                onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Transmisi</label>
              <select
                className="form-control"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Bahan Bakar</label>
              <select
                className="form-control"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="gasoline">Bensin (Gasoline)</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric (EV)</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tarif Harian (Rp/Hari)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Contoh: 350000"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deposit Jaminan (Rp)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Contoh: 500000"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL Foto Kendaraan</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi & Fasilitas</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Kondisi terawat, AC dingin, wangi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Menyimpan...' : initialData ? 'Perbarui Armada' : 'Tambahkan Armada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormKendaraan;
