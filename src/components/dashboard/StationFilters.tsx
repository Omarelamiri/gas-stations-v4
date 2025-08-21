'use client';

import  Card  from '@/components/ui/Card';

interface StationFiltersProps {
  availableCities: string[];
  selectedCities: string[];
  onCityChange: (city: string, isSelected: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function StationFilters({
  availableCities,
  selectedCities,
  onCityChange,
  onSelectAll,
  onClearAll
}: StationFiltersProps) {
  const isAllSelected = selectedCities.length === availableCities.length;
  const isNoneSelected = selectedCities.length === 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Filter by City
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            disabled={isAllSelected}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            disabled={isNoneSelected}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {availableCities.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No cities available
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {availableCities.map((city) => {
            const isSelected = selectedCities.includes(city);
            
            return (
              <div key={city} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`city-${city}`}
                  checked={isSelected}
                  onChange={(e) => onCityChange(city, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <label
                  htmlFor={`city-${city}`}
                  className={`text-sm cursor-pointer transition-colors ${
                    isSelected 
                      ? 'text-blue-700 font-medium' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {city}
                </label>
              </div>
            );
          })}
        </div>
      )}

      {/* Selection Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {selectedCities.length === 0 
            ? 'No cities selected'
            : `${selectedCities.length} of ${availableCities.length} cities selected`
          }
        </p>
      </div>
    </Card>
  );
}