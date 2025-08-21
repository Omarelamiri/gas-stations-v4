'use client';

import React from 'react';

interface CityFilterProps {
  cities: string[];
  selectedCities: string[];
  onCityChange: (city: string, isChecked: boolean) => void;
  onAllChange: (isChecked: boolean) => void;
}

const CityFilters: React.FC<CityFilterProps> = ({ cities, selectedCities, onCityChange, onAllChange }) => {
  const isAllSelected = selectedCities.length === cities.length;

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filter by City</h2>
      <div className="flex flex-wrap gap-4">
        {/* 'All' Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="all-cities"
            checked={isAllSelected}
            onChange={(e) => onAllChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="all-cities" className="ml-2 font-semibold text-sm text-gray-900">
            All Cities
          </label>
        </div>

        {/* Individual City Checkboxes */}
        {cities.map((city) => (
          <div key={city} className="flex items-center">
            <input
              type="checkbox"
              id={`city-${city}`}
              checked={selectedCities.includes(city)}
              onChange={(e) => onCityChange(city, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`city-${city}`} className="ml-2 text-sm text-gray-900">
              {city}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityFilters;