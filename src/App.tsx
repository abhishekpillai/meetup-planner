import React, { useState } from 'react';
import { MapPin, Loader2, List, Map } from 'lucide-react';
import { LocationInput } from './components/LocationInput';
import { LocationList } from './components/LocationList';
import { ActivityList } from './components/ActivityList';
import { ActivityFilters } from './components/ActivityFilters';
import { MapView } from './components/MapView';
import { useLocationStore } from './store/locationStore';
import { findMidpoint, searchNearbyPlaces } from './utils/maps';
import { sortActivities } from './utils/activityUtils';
import { Activity, SortOption } from './types';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const locations = useLocationStore((state) => state.locations);

  const handleFindActivities = async () => {
    if (locations.length < 2) return;
    
    setLoading(true);
    try {
      const midpoint = findMidpoint(locations);
      const nearbyActivities = await searchNearbyPlaces(midpoint);
      setActivities(nearbyActivities);
    } catch (error) {
      console.error('Failed to find activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedActivities = sortActivities(activities, sortBy);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Meetup Planner
          </h1>
          <p className="text-gray-600">
            Find the perfect restaurant to meet up with your friends
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <LocationInput />
            <LocationList />
          </div>

          {locations.length >= 2 && (
            <div className="flex justify-center">
              <button
                onClick={handleFindActivities}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Finding restaurants...
                  </>
                ) : (
                  <>
                    <MapPin size={20} />
                    Find Restaurants
                  </>
                )}
              </button>
            </div>
          )}

          {activities.length > 0 && (
            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-2xl flex justify-between items-center">
                <ActivityFilters
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-lg ${
                      viewMode === 'map'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Map size={20} />
                  </button>
                </div>
              </div>
              {viewMode === 'list' ? (
                <ActivityList
                  activities={sortedActivities}
                  locations={locations}
                />
              ) : (
                <MapView
                  activities={sortedActivities}
                  locations={locations}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;