// File: src/lib/utils/stationUtils.ts
// Utility functions have been updated to reflect the new field names,
// particularly for provinces and brands.

import { GasStation } from '@/types/station';

/**
 * Generate a label for a gas station
 */

export const stationLabel = (s: GasStation) => `${s['Nom de Station']} — ${s['Commune']}`;


/**
 * Extract unique provinces from gas stations array
 */
export function extractUniqueProvinces(stations: GasStation[]): string[] {
  const provinces = new Set<string>();
  
  stations.forEach(station => {
    if (station['Province'] && station['Province'].trim()) {
      provinces.add(station['Province'].trim());
    }
  });
  
  return Array.from(provinces).sort();
}

/**
 * Get unique brands from stations
 */
export function getUniqueBrands(stations: GasStation[]): string[] {
  const brands = new Set<string>();
  
  stations.forEach(station => {
    if (station['Marque'] && station['Marque'].trim()) {
      brands.add(station['Marque'].trim());
    }
  });
  
  return Array.from(brands).sort();
}

/**
 * Get stations by type
 */
export function getStationsByType(stations: GasStation[], type: 'service' | 'remplissage'): GasStation[] {
  return stations.filter(station => station['Type'] === type);
}

/**
 * Format capacity for display
 */
export function formatCapacity(capacity: number): string {
  if (capacity === 0) return 'N/A';
  return `${capacity.toLocaleString()} L`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return date.toLocaleDateString('fr-FR');
}