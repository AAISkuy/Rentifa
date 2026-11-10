export interface UserProfile {
  id: number;
  email: string;
  role: 'customer' | 'admin';
  full_name?: string;
  phone_number?: string;
  address?: string;
  city?: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
