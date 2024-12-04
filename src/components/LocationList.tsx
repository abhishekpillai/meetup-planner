import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useLocationStore } from '../store/locationStore';

export const LocationList: React.FC = () => {
  const { locations, removeLocation } = useLocationStore();

  if (locations.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-md space-y-2">
      {locations.map((location) => (
        <div
          key={location.id}
          className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-400" size={20} />
            <div>
              <p className="font-medium">{location.name}</p>
              <p className="text-sm text-gray-500">{location.address}</p>
            </div>
          </div>
          <button
            onClick={() => removeLocation(location.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};