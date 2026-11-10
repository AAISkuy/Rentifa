export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'car' | 'motorcycle';
  description?: string;
  icon?: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category_type: string;
}

export interface VehicleImage {
  id: number;
  vehicle_id: number;
  image_url: string;
  caption?: string;
  is_primary: number;
}

export interface Vehicle {
  id: number;
  category_id: number;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  transmission: 'manual' | 'automatic';
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  seating_capacity: number;
  luggage_capacity: number;
  daily_rate: number | string;
  security_deposit: number | string;
  status: 'available' | 'maintenance' | 'inactive';
  description?: string;
  category_name?: string;
  category_type?: 'car' | 'motorcycle';
  primary_image?: string;
  images?: VehicleImage[];
  amenities?: Amenity[];
}

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
  booking_status:
    | 'pending_confirmation'
    | 'confirmed'
    | 'rejected'
    | 'expired'
    | 'cancelled'
    | 'active_rental'
    | 'completed';
  hold_expires_at?: string;
  customer_notes?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_license_plate?: string;
  vehicle_image?: string;
  payment_status?: string;
  payment_method?: string;
  created_at: string;
}
