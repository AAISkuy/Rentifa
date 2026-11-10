export interface VehicleCategory {
  id: number;
  name: string;
  slug: string;
  type: 'car' | 'motorcycle';
  description?: string;
  icon?: string;
}

export interface VehicleImage {
  id: number;
  vehicle_id: number;
  image_url: string;
  caption?: string;
  is_primary: number;
  display_order: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
  category_type: 'all' | 'car' | 'motorcycle';
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
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_type?: 'car' | 'motorcycle';
  primary_image?: string;
  images?: VehicleImage[];
  amenities?: Amenity[];
}

export interface VehicleFilter {
  category_id?: number;
  type?: 'car' | 'motorcycle';
  search?: string;
  transmission?: 'manual' | 'automatic';
  min_price?: number;
  max_price?: number;
  status?: string;
}
