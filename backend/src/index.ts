import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

import penggunaRoutes from './routes/Pengguna';
import kendaraanRoutes from './routes/Kendaraan';
import reservasiRoutes from './routes/Reservasi';
import { errorHandler } from './middleware/Error';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Rentifa Backend API',
  });
});

// API Routes
app.use('/api/auth', penggunaRoutes);
app.use('/api/vehicles', kendaraanRoutes);
app.use('/api/bookings', reservasiRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan.',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Rentifa Server running on http://localhost:${PORT}`);
});

export default app;
