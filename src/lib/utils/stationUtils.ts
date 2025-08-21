import { GasStation } from '@/types/station';

/**
 * Extract unique cities from gas stations array
 */
export function extractUniqueCities(stations: GasStation[]): string[] {
  const cities = new Set<string>();
  
  stations.forEach(station => {
    if (station.city && station.city.trim()) {
      cities.add(station.city.trim());
    }
  });
  
  return Array.from(cities).sort();
}

/**
 * Calculate average price for a specific fuel type
 */
export function calculateAveragePrice(
  stations: GasStation[], 
  fuelType: string
): number | null {
  const stationsWithPrice = stations.filter(station => 
    station.prices && 
    typeof station.prices[fuelType] === 'number' &&
    station.prices[fuelType] > 0
  );
  
  if (stationsWithPrice.length === 0) return null;
  
  const total = stationsWithPrice.reduce((sum, station) => 
    sum + station.prices[fuelType], 0
  );
  
  return Math.round((total / stationsWithPrice.length) * 100) / 100;
}

/**
 * Get unique brands from stations
 */
export function getUniqueBrands(stations: GasStation[]): string[] {
  const brands = new Set<string>();
  
  stations.forEach(station => {
    if (station.brand && station.brand.trim()) {
      brands.add(station.brand.trim());
    }
  });
  
  return Array.from(brands).sort();
}

/**
 * Filter stations that have shops
 */
export function getStationsWithShops(stations: GasStation[]): GasStation[] {
  return stations.filter(station => station.hasShop === true);
}

/**
 * Get the most common fuel type across stations
 */
export function getMostCommonFuelType(stations: GasStation[]): string | null {
  const fuelTypeCounts = new Map<string, number>();
  
  stations.forEach(station => {
    if (station.fuelTypes && Array.isArray(station.fuelTypes)) {
      station.fuelTypes.forEach(fuelType => {
        fuelTypeCounts.set(fuelType, (fuelTypeCounts.get(fuelType) || 0) + 1);
      });
    }
  });
  
  if (fuelTypeCounts.size === 0) return null;
  
  let mostCommon = '';
  let highestCount = 0;
  
  fuelTypeCounts.forEach((count, fuelType) => {
    if (count > highestCount) {
      highestCount = count;
      mostCommon = fuelType;
    }
  });
  
  return mostCommon || null;
}

/**
 * Format price for display
 */
export function formatPrice(price: number | null): string {
  if (price === null) return 'N/A';
  return `${price.toFixed(2)} MAD`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}