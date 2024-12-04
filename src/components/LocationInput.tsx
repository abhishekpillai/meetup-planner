import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { geocodeAddress } from '../utils/maps';
import { useLocationStore } from '../store/locationStore';

export const LocationInput: React.FC = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const addLocation = useLocationStore((state) => state.addLocation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const location = await geocodeAddress(address);
      addLocation(location);
      setAddress('');
    } catch (err) {
      setError('Failed to find location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter location address..."
          className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !address}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </form>
  );
};