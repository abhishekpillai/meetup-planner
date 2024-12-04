import { create } from 'zustand';
import { Location } from '../types';

interface LocationState {
  locations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  clearLocations: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  addLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),
  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((loc) => loc.id !== id),
    })),
  clearLocations: () => set({ locations: [] }),
}));