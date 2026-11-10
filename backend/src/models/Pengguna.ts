export interface User {
  id: number;
  email: string;
  password_hash?: string;
  role: 'customer' | 'admin';
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerProfile {
  id: number;
  user_id: number;
  full_name: string;
  phone_number: string;
  address?: string;
  city?: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends User {
  full_name?: string;
  phone_number?: string;
  address?: string;
  city?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: 'customer' | 'admin';
    full_name?: string;
    phone_number?: string;
  };
}
