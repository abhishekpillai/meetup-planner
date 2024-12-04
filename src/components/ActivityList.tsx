import React from 'react';
import { Activity, Location } from '../types';
import { MapPin, Star, Navigation, DollarSign, Phone, Globe } from 'lucide-react';
import { calculateDistance, getGoogleMapsUrl } from '../utils/maps';

interface ActivityListProps {
  activities: Activity[];
  locations: Location[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities, locations }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No restaurants found in this area. Try adjusting your search.
      </div>
    );
  }

  const getPriceLevel = (level?: number) => {
    if (!level && level !== 0) return '';
    return Array(level + 1).fill('$').join('');
  };

  return (
    <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
      {activities.map((activity) => {
        const distances = locations.map(location => ({
          name: location.name,
          distance: calculateDistance(
            location.lat,
            location.lng,
            activity.lat,
            activity.lng
          ),
        }));

        return (
          <div key={activity.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {activity.photoUrl && (
              <img
                src={activity.photoUrl}
                alt={activity.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{activity.name}</h3>
                {activity.priceLevel !== undefined && (
                  <span className="text-green-600 font-medium">
                    {getPriceLevel(activity.priceLevel)}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <MapPin size={16} />
                <span>{activity.address}</span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                {activity.rating && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    <span>{activity.rating}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2 text-sm text-gray-600">
                {activity.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    <a href={`tel:${activity.phone}`} className="hover:text-blue-500">
                      {activity.phone}
                    </a>
                  </div>
                )}
                {activity.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={14} />
                    <a 
                      href={activity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-500 truncate"
                    >
                      {new URL(activity.website).hostname}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Navigation size={14} />
                  <div className="flex flex-wrap gap-x-3">
                    {distances.map((dist, index) => (
                      <span key={index}>
                        {dist.name.split(',')[0]}: {dist.distance.toFixed(1)} mi
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <a
                  href={getGoogleMapsUrl(activity.lat, activity.lng, activity.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  View on Maps
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};