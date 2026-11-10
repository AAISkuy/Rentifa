import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import HalamanBeranda from './pages/HalamanBeranda';
import HalamanDetail from './pages/HalamanDetail';
import HalamanTracking from './pages/HalamanTracking';
import HalamanPesananSaya from './pages/HalamanPesananSaya';
import HalamanLogin from './pages/HalamanLogin';
import HalamanRegister from './pages/HalamanRegister';

// Admin Pages
import LayoutAdmin from './components/layout/LayoutAdmin';
import Beranda from './pages/admin/Beranda';
import HalamanBooking from './pages/admin/HalamanBooking';
import HalamanProduk from './pages/admin/HalamanProduk';
import HalamanPengguna from './pages/admin/HalamanPengguna';

// CSS
import './css/Base.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<HalamanBeranda />} />
          <Route path="/vehicles/:id" element={<HalamanDetail />} />
          <Route path="/tracking" element={<HalamanTracking />} />
          <Route path="/tracking/:code" element={<HalamanTracking />} />
          <Route path="/my-bookings" element={<HalamanPesananSaya />} />
          <Route path="/login" element={<HalamanLogin />} />
          <Route path="/register" element={<HalamanRegister />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Beranda />} />
            <Route path="bookings" element={<HalamanBooking />} />
            <Route path="vehicles" element={<HalamanProduk />} />
            <Route path="users" element={<HalamanPengguna />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
