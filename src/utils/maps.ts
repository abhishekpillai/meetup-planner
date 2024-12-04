import { Loader } from '@googlemaps/js-api-loader';
import { Location, Activity } from '../types';

export const GOOGLE_MAPS_API_KEY = 'AIzaSyCV9PbleU5xooQDZj07HmaN7oQqEvdWbBc';

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places'],
});

export const geocodeAddress = async (address: string): Promise<Location> => {
  const google = await loader.load();
  const geocoder = new google.maps.Geocoder();
  
  const result = await geocoder.geocode({ address });
  if (!result.results[0]) {
    throw new Error('Location not found');
  }

  const { lat, lng } = result.results[0].geometry.location;
  return {
    id: crypto.randomUUID(),
    name: address,
    address: result.results[0].formatted_address,
    lat: lat(),
    lng: lng(),
  };
};

export const findMidpoint = (locations: Location[]): google.maps.LatLngLiteral => {
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
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getGoogleMapsUrl = (lat: number, lng: number, name: string): string => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query=${lat},${lng}`;
};

export const searchNearbyPlaces = async (
  center: google.maps.LatLngLiteral,
  radius: number = 8000 // Increased radius to 8km
): Promise<Activity[]> => {
  const google = await loader.load();
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );

  return new Promise((resolve, reject) => {
    service.nearbySearch(
      {
        location: center,
        radius,
        type: ['restaurant'],
        rankBy: google.maps.places.RankBy.RATING
      },
      async (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const activities: Activity[] = [];
          
          for (const place of results) {
            // Skip if it's a locality or administrative area
            if (place.types?.some(type => 
              ['locality', 'administrative_area_level_1', 'administrative_area_level_2', 
               'administrative_area_level_3', 'political'].includes(type)
            )) {
              continue;
            }

            // Get additional details for each place
            try {
              const details = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
                service.getDetails(
                  { placeId: place.place_id!, fields: ['price_level', 'website', 'formatted_phone_number'] },
                  (result, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                      resolve(result);
                    } else {
                      reject(status);
                    }
                  }
                );
              });

              activities.push({
                id: place.place_id || crypto.randomUUID(),
                name: place.name || '',
                address: place.vicinity || '',
                rating: place.rating,
                types: place.types || [],
                photoUrl: place.photos?.[0]?.getUrl(),
                lat: place.geometry?.location?.lat() || 0,
                lng: place.geometry?.location?.lng() || 0,
                priceLevel: details.price_level,
                website: details.website,
                phone: details.formatted_phone_number
              });
            } catch (error) {
              console.warn('Failed to get details for place:', place.name);
            }
          }
          
          resolve(activities);
        } else {
          reject(new Error('Failed to fetch nearby places'));
        }
      }
    );
  });
};