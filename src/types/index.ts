export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  name: string;
  address: string;
  rating?: number;
  types: string[];
  photoUrl?: string;
  lat: number;
  lng: number;
  priceLevel?: number;
  website?: string;
  phone?: string;
}

export type SortOption = 'rating' | 'name' | 'price' | 'none';