import { NewGasStation } from '@/types/station';

export function validateStationData(
  data: Partial<NewGasStation>,
  requireAll: boolean = true
): ValidationResult {
  const errors: string[] = [];

  // Required fields validation
  if (requireAll || data['Nom de Station'] !== undefined) {
    if (!data['Nom de Station'] || data['Nom de Station'].trim().length === 0) {
      errors.push('Station name is required');
    }
  }

  if (requireAll || data['Adesse'] !== undefined) {
    if (!data['Adesse'] || data['Adesse'].trim().length === 0) {
      errors.push('Address is required');
    }
  }

  if (requireAll || data['Province'] !== undefined) {
    if (!data['Province'] || data['Province'].trim().length === 0) {
      errors.push('Province is required');
    }
  }

  if (requireAll || data['Gérant'] !== undefined) {
    if (!data['Gérant'] || data['Gérant'].trim().length === 0) {
      errors.push('Manager is required');
    }
  }

  if (requireAll || data['numéro de création'] !== undefined) {
    if (!data['numéro de création'] || data['numéro de création'].trim().length === 0) {
      errors.push('Creation number is required');
    }
  }

  if (requireAll || data['numéro de Mise en service'] !== undefined) {
    if (!data['numéro de Mise en service'] || data['numéro de Mise en service'].trim().length === 0) {
      errors.push('Service number is required');
    }
  }

  // Coordinate validation
  if (data['Latitude'] !== undefined) {
    const lat = parseFloat(data['Latitude']);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90');
    }
  }

  if (data['Longitude'] !== undefined) {
    const lng = parseFloat(data['Longitude']);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Longitude must be a valid number between -180 and 180');
    }
  }

  // Capacity validation
  if (data['Capacité Gasoil'] !== undefined && data['Capacité Gasoil'].trim() !== '') {
    const capacity = parseFloat(data['Capacité Gasoil']);
    if (isNaN(capacity) || capacity < 0) {
      errors.push('Gasoil capacity must be a valid positive number');
    }
  }

  if (data['Capacité SSP'] !== undefined && data['Capacité SSP'].trim() !== '') {
    const capacity = parseFloat(data['Capacité SSP']);
    if (isNaN(capacity) || capacity < 0) {
      errors.push('SSP capacity must be a valid positive number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}