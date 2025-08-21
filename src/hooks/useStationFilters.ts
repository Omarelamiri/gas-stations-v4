'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { GasStation } from '@/types/station';
import { StationFiltersState, StationFiltersActions } from '@/types/dashboard';
import { extractUniqueCities } from '@/lib/utils/stationUtils';
import { DEFAULT_CITY } from '@/lib/utils/constants';

export function useStationFilters(stations: GasStation[]): {
  availableCities: string[];
  selectedCities: string[];
  filteredStations: GasStation[];
  actions: StationFiltersActions;
} {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Memoize available cities calculation
  const availableCities = useMemo(() => {
    return extractUniqueCities(stations);
  }, [stations]);

  // Initialize selected cities when available cities change
  useEffect(() => {
    if (availableCities.length > 0) {
      setSelectedCities(prevSelected => {
        // If no previous selection, default to DEFAULT_CITY if available, otherwise all cities
        if (prevSelected.length === 0) {
          return availableCities.includes(DEFAULT_CITY) 
            ? [DEFAULT_CITY] 
            : availableCities;
        }

        // Filter out cities that are no longer available
        const validSelected = prevSelected.filter(city => 
          availableCities.includes(city)
        );

        // If no valid selections remain, select all available cities
        return validSelected.length > 0 ? validSelected : availableCities;
      });
    }
  }, [availableCities]);

  // Memoize filtered stations
  const filteredStations = useMemo(() => {
    if (selectedCities.length === 0) return [];
    
    return stations.filter(station => 
      station.city && selectedCities.includes(station.city)
    );
  }, [stations, selectedCities]);

  // Action handlers
  const updateCityFilter = useCallback((city: string, isSelected: boolean) => {
    setSelectedCities(prev => {
      if (isSelected) {
        return prev.includes(city) ? prev : [...prev, city];
      } else {
        return prev.filter(c => c !== city);
      }
    });
  }, []);

  const selectAllCities = useCallback(() => {
    setSelectedCities(availableCities);
  }, [availableCities]);

  const clearAllCities = useCallback(() => {
    setSelectedCities([]);
  }, []);

  const actions: StationFiltersActions = {
    updateCityFilter,
    selectAllCities,
    clearAllCities
  };

  return {
    availableCities,
    selectedCities,
    filteredStations,
    actions
  };
}