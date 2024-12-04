import React from 'react';
import { SortOption } from '../types';

interface ActivityFiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <label className="text-gray-600">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="none">Default</option>
          <option value="rating">Highest Rating</option>
          <option value="price">Price (Low to High)</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
};