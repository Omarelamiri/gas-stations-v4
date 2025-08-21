import { GasStation } from '@/types/station';
import { SortConfig } from '@/types/table';

/**
 * Filter stations based on search query
 */
export function filterStations(stations: GasStation[], searchQuery: string): GasStation[] {
  if (!searchQuery || searchQuery.trim() === '') {
    return stations;
  }

  const query = searchQuery.toLowerCase().trim();
  
  return stations.filter(station => {
    // Search in name, address, city, and brand
    const searchableText = [
      station.name,
      station.address,
      station.city,
      station.brand
    ].join(' ').toLowerCase();
    
    return searchableText.includes(query);
  });
}

/**
 * Sort stations based on sort configuration
 */
export function sortStations(stations: GasStation[], sortConfig: SortConfig): GasStation[] {
  if (!sortConfig.key) {
    return stations;
  }

  return [...stations].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // Handle nested properties (e.g., 'prices.diesel')
    if (sortConfig.key.includes('.')) {
      const keys = sortConfig.key.split('.');
      aValue = getNestedValue(a, keys);
      bValue = getNestedValue(b, keys);
    } else {
      aValue = a[sortConfig.key as keyof GasStation];
      bValue = b[sortConfig.key as keyof GasStation];
    }

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
    if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

    // Handle different data types
    let comparison = 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      comparison = (aValue === bValue) ? 0 : aValue ? 1 : -1;
    } else {
      // Convert to strings for comparison
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Get value from nested object property
 */
function getNestedValue(obj: any, keys: string[]): any {
  return keys.reduce((current, key) => current?.[key], obj);
}

/**
 * Paginate results
 */
export function paginateResults<T>(
  items: T[], 
  currentPage: number, 
  itemsPerPage: number
): T[] {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return items.slice(startIndex, endIndex);
}

/**
 * Calculate pagination information
 */
export function calculatePagination(
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    totalPages,
    currentPage,
    totalItems,
    itemsPerPage,
    startIndex,
    endIndex,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages
  };
}

/**
 * Generate page numbers for pagination display
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | '...')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  // Always show first page
  pages.push(1);

  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust range if we're near the beginning or end
  if (currentPage <= halfVisible + 1) {
    end = Math.min(totalPages - 1, maxVisible - 1);
  } else if (currentPage >= totalPages - halfVisible) {
    start = Math.max(2, totalPages - maxVisible + 2);
  }

  // Add ellipsis before start if needed
  if (start > 2) {
    pages.push('...');
  }

  // Add page numbers
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis after end if needed
  if (end < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page (if more than 1 page)
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}