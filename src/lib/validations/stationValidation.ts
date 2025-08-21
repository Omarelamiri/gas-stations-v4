import { NewGasStation } from '@/types/station';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate station data before saving
 */
export function validateStationData(
  data: Partial<NewGasStation>,
  requireAll: boolean = true
): ValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (requireAll || data.name !== undefined) {
    if (!data.name || data.name.trim().length === 0) {
      errors.push('Station name is required');
    } else if (data.name.trim().length < 2) {
      errors.push('Station name must be at least 2 characters long');
    } else if (data.name.trim().length > 100) {
      errors.push('Station name must be less than 100 characters');
    }
  }

  if (requireAll || data.address !== undefined) {
    if (!data.address || data.address.trim().length === 0) {
      errors.push('Address is required');
    } else if (data.address.trim().length < 5) {
      errors.push('Address must be at least 5 characters long');
    } else if (data.address.trim().length > 200) {
      errors.push('Address must be less than 200 characters');
    }
  }

  if (requireAll || data.city !== undefined) {
    if (!data.city || data.city.trim().length === 0) {
      errors.push('City is required');
    } else if (data.city.trim().length < 2) {
      errors.push('City name must be at least 2 characters long');
    } else if (data.city.trim().length > 50) {
      errors.push('City name must be less than 50 characters');
    }
  }

  // Optional but validated fields
  if (data.brand && data.brand.trim().length > 50) {
    errors.push('Brand name must be less than 50 characters');
  }

  // Coordinate validation
  if (data.latitude !== undefined) {
    const lat = parseFloat(data.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90');
    }
  }

  if (data.longitude !== undefined) {
    const lng = parseFloat(data.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Longitude must be a valid number between -180 and 180');
    }
  }

  // Price validation
  if (data.dieselPrice !== undefined && data.dieselPrice.trim() !== '') {
    const price = parseFloat(data.dieselPrice);
    if (isNaN(price) || price <= 0) {
      errors.push('Diesel price must be a valid positive number');
    } else if (price > 100) {
      errors.push('Diesel price seems too high (max 100 MAD)');
    }
  }

  if (data.gasoline95Price !== undefined && data.gasoline95Price.trim() !== '') {
    const price = parseFloat(data.gasoline95Price);
    if (isNaN(price) || price <= 0) {
      errors.push('Gasoline 95 price must be a valid positive number');
    } else if (price > 100) {
      errors.push('Gasoline 95 price seems too high (max 100 MAD)');
    }
  }

  // Arrays validation
  if (data.fuelTypes && !Array.isArray(data.fuelTypes)) {
    errors.push('Fuel types must be an array');
  }

  if (data.services && !Array.isArray(data.services)) {
    errors.push('Services must be an array');
  }

  // Open hours validation
  if (data.openHours && data.openHours.length > 50) {
    errors.push('Open hours must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate coordinates are within Morocco bounds (approximately)
 */
export function validateMoroccanCoordinates(latitude: number, longitude: number): boolean {
  // Morocco approximate bounds
  const moroccanBounds = {
    north: 35.9,
    south: 27.6,
    east: -1.0,
    west: -17.1
  };

  return (
    latitude >= moroccanBounds.south &&
    latitude <= moroccanBounds.north &&
    longitude >= moroccanBounds.west &&
    longitude <= moroccanBounds.east
  );
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}