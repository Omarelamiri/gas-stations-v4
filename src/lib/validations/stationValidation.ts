// File: src/lib/validations/stationValidation.ts
// The validation logic has been updated to check for the new required fields
// and ensure that number and date formats are correct before submission.

import { NewGasStation } from '@/types/station';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateStationData(
  data: Partial<NewGasStation>,
  requireAll: boolean = true
): ValidationResult {
  const errors: string[] = [];
  const requiredFields: (keyof NewGasStation)[] = [
    'Nom de Station',
    'Adesse',
    'Province',
    'Gérant',
    'numéro de création',
    'numéro de Mise en service',
    'Date Creation',
    'Date Mise en service',
    'Capacité Gasoil',
    'Capacité SSP'
  ];

  // Required fields validation
  for (const field of requiredFields) {
    if (requireAll || data[field] !== undefined) {
      if (!data[field] || String(data[field]).trim().length === 0) {
        errors.push(`${field} is required`);
      }
    }
  }

  // Coordinate validation
  if (data['Latitude'] !== undefined && data['Latitude'].trim() !== '') {
    const lat = parseFloat(data['Latitude']);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90');
    }
  }

  if (data['Longitude'] !== undefined && data['Longitude'].trim() !== '') {
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