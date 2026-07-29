import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ejxxhpflfcxvjkavzbwn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🏛️ University Campus Anchor Landmark
export interface UniversityLandmark {
  id: string;
  name: string;
  shortCode: string; // e.g. UPM, UST, DLSU, FEU, PUP, Mapua
  lat: number;
  lng: number;
  city?: string;
}

// ☕ Third Space Spot (Cafes, Libraries, Budget Kainan, Study Hubs)
export interface ThirdSpace {
  id: string;
  university_id?: string; // Links spot to nearest university landmark!
  title: string;
  category: string;
  description: string;
  address: string;
  location?: { coordinates: [number, number] };
  lat?: number;
  lng?: number;
  price_range: string;
  has_wifi: boolean;
  has_outlets: boolean;
  is_24_7: boolean;
  is_free: boolean;
  needs_student_id: boolean;
  comp_shop_reg_required?: boolean;
  indoor_outdoor?: string;
  seat_capacity?: string;
  overall_rating?: number; // e.g. 4.9
  total_reviews?: number; // e.g. 340
  commute_info?: {
    lrt?: string;
    jeep?: string;
    bus?: string;
    fx?: string;
  };
  peak_hours?: string;
  panorama_url?: string;
  cover_image_url?: string;
}

export interface Review {
  id: string;
  space_id: string;
  user_display_name: string;
  rating: number;
  wifi_speed_mbps?: number;
  outlet_accessibility?: number;
  comment: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}
