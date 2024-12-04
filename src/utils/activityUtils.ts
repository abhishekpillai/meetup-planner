import { Activity, SortOption } from '../types';

export const sortActivities = (
  activities: Activity[],
  sortBy: SortOption
): Activity[] => {
  const sortedActivities = [...activities];

  switch (sortBy) {
    case 'rating':
      return sortedActivities.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'name':
      return sortedActivities.sort((a, b) => a.name.localeCompare(b.name));
    case 'price':
      return sortedActivities.sort((a, b) => (a.priceLevel || 0) - (b.priceLevel || 0));
    default:
      return sortedActivities;
  }
};