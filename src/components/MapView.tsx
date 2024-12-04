import React, { useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Activity, Location } from '../types';
import { MapPin } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '../utils/maps';

interface MapViewProps {
  activities: Activity[];
  locations: Location[];
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
};

export const MapView: React.FC<MapViewProps> = ({ activities, locations }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const center = React.useMemo(() => {
    if (locations.length === 0) return { lat: 0, lng: 0 };
    const total = locations.reduce(
      (acc, loc) => ({
        lat: acc.lat + loc.lat,
        lng: acc.lng + loc.lng,
      }),
      { lat: 0, lng: 0 }
    );
    return {
      lat: total.lat / locations.length,
      lng: total.lng / locations.length,
    };
  }, [locations]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="w-full max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
      >
        {/* Location markers */}
        {locations.map((location) => (
          <MarkerF
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              path: MapPin,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 1.5,
            }}
            title={location.name}
          />
        ))}

        {/* Activity markers */}
        {activities.map((activity) => (
          <MarkerF
            key={activity.id}
            position={{ lat: activity.lat, lng: activity.lng }}
            onClick={() => setSelectedActivity(activity)}
          />
        ))}

        {/* Info window for selected activity */}
        {selectedActivity && (
          <InfoWindowF
            position={{ lat: selectedActivity.lat, lng: selectedActivity.lng }}
            onCloseClick={() => setSelectedActivity(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedActivity.name}</h3>
              <p className="text-sm text-gray-600">{selectedActivity.address}</p>
              {selectedActivity.rating && (
                <p className="text-sm text-yellow-500">
                  Rating: {selectedActivity.rating}
                </p>
              )}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
};