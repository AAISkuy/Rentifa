import ApiClient, { type ApiResponse } from './Client';
import type { Vehicle, Category, Booking } from '../models/Kendaraan';

export class KendaraanApi {
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    return ApiClient.get('/vehicles/categories');
  }

  static async getCatalog(params?: {
    category_id?: number;
    type?: string;
    search?: string;
    transmission?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<ApiResponse<Vehicle[]>> {
    const query = new URLSearchParams();
    if (params) {
      if (params.category_id) query.append('category_id', String(params.category_id));
      if (params.type) query.append('type', params.type);
      if (params.search) query.append('search', params.search);
      if (params.transmission) query.append('transmission', params.transmission);
      if (params.min_price) query.append('min_price', String(params.min_price));
      if (params.max_price) query.append('max_price', String(params.max_price));
    }
    const qs = query.toString();
    return ApiClient.get(`/vehicles${qs ? '?' + qs : ''}`);
  }

  static async getDetail(id: number): Promise<ApiResponse<Vehicle>> {
    return ApiClient.get(`/vehicles/${id}`);
  }

  // Admin Vehicle CRUD
  static async getAllForAdmin(): Promise<ApiResponse<Vehicle[]>> {
    return ApiClient.get('/vehicles/admin/all');
  }

  static async createVehicle(data: any): Promise<ApiResponse<Vehicle>> {
    return ApiClient.post('/vehicles', data);
  }

  static async updateVehicle(id: number, data: any): Promise<ApiResponse<Vehicle>> {
    return ApiClient.put(`/vehicles/${id}`, data);
  }

  static async deleteVehicle(id: number): Promise<ApiResponse<any>> {
    return ApiClient.delete(`/vehicles/${id}`);
  }

  // Bookings
  static async createBooking(data: {
    vehicle_id: number;
    start_date: string;
    end_date: string;
    customer_notes?: string;
    payment_method?: string;
  }): Promise<ApiResponse<Booking>> {
    return ApiClient.post('/bookings', data);
  }

  static async getBookingByCode(code: string): Promise<ApiResponse<Booking>> {
    return ApiClient.get(`/bookings/tracking/${code}`);
  }

  static async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    return ApiClient.get('/bookings/my-bookings');
  }

  static async getAdminBookings(status?: string): Promise<ApiResponse<Booking[]>> {
    const qs = status ? `?status=${status}` : '';
    return ApiClient.get(`/bookings/admin/all${qs}`);
  }

  static async updateBookingStatus(
    id: number,
    status: string,
    notes?: string
  ): Promise<ApiResponse<Booking>> {
    return ApiClient.patch(`/bookings/admin/${id}/status`, { status, notes });
  }

  static async getDashboardStats(): Promise<ApiResponse<any>> {
    return ApiClient.get('/bookings/admin/stats');
  }
}

export default KendaraanApi;
