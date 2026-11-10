import ApiClient, { type ApiResponse } from './Client';
import type { UserProfile } from '../models/Akun';

export class PenggunaApi {
  static async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    return ApiClient.post('/auth/login', { email, password });
  }

  static async register(data: {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
  }): Promise<ApiResponse<{ token: string; user: UserProfile }>> {
    return ApiClient.post('/auth/register', data);
  }

  static async getProfile(): Promise<ApiResponse<UserProfile>> {
    return ApiClient.get('/auth/profile');
  }

  static async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return ApiClient.put('/auth/profile', data);
  }

  static async getAllUsers(): Promise<ApiResponse<UserProfile[]>> {
    return ApiClient.get('/auth/users');
  }
}

export default PenggunaApi;
