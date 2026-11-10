export type BookingStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'rejected'
  | 'expired'
  | 'cancelled'
  | 'active_rental'
  | 'completed';

export interface Booking {
  id: number;
  booking_code: string;
  customer_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  daily_rate_snapshot: number | string;
  rental_subtotal: number | string;
  security_deposit_snapshot: number | string;
  grand_total: number | string;
  booking_status: BookingStatus;
  hold_expires_at?: string;
  hold_extension_count?: number;
  identity_check_status?: 'unverified' | 'valid' | 'invalid';
  identity_checked_by?: number;
  identity_checked_at?: string;
  identity_check_notes?: string;
  rejection_reason?: string;
  cancellation_reason?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;

  // Joined fields
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_license_plate?: string;
  vehicle_image?: string;
  vehicle_type?: 'car' | 'motorcycle';
  payment_status?: string;
  payment_method?: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  payment_method: string;
  amount: number | string;
  payment_status: 'pending' | 'paid' | 'failed';
  paid_at?: string;
  created_at: string;
}

export interface CreateBookingDTO {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  customer_notes?: string;
  payment_method?: string;
}
