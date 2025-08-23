// File: src/hooks/useStationForm.ts
// This hook is completely rewritten to handle the new form fields,
// initial data, and validation logic.

'use client';

import { useState, useCallback, useEffect } from 'react';
import { GasStation, NewGasStation } from '@/types/station';
import { useStationCRUD } from '@/hooks/useStationCRUD';
import { validateStationData } from '@/lib/validations/stationValidation';

interface UseStationFormProps {
  mode: 'create' | 'edit';
  initialData?: GasStation;
  onSuccess: () => void;
}

interface FormErrors {
  'Nom de Station'?: string;
  'Raison sociale'?: string;
  'Marque'?: string;
  'Propriétaire'?: string;
  'Gérant'?: string;
  'CIN Gérant'?: string;
  'Adesse'?: string;
  'Latitude'?: string;
  'Longitude'?: string;
  'Commune'?: string;
  'Province'?: string;
  'Type'?: string;
  'Type Autorisation'?: string;
  'Date Creation'?: string;
  'numéro de création'?: string;
  'Date Mise en service'?: string;
  'numéro de Mise en service'?: string;
  'Capacité Gasoil'?: string;
  'Capacité SSP'?: string;
  'numéro de Téléphone'?: string;
  submit?: string;
}

const initialFormData: NewGasStation = {
  'Nom de Station': '',
  'Raison sociale': '',
  'Marque': '',
  'Propriétaire': '',
  'Gérant': '',
  'CIN Gérant': '',
  'Adesse': '',
  'Latitude': '',
  'Longitude': '',
  'Commune': '',
  'Province': '',
  'Type': 'service',
  'Type Autorisation': 'création',
  'Date Creation': '',
  'numéro de création': '',
  'Date Mise en service': '',
  'numéro de Mise en service': '',
  'Capacité Gasoil': '',
  'Capacité SSP': '',
  'numéro de Téléphone': '',
};

const formatDateToInput = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const transformStationToForm = (station: GasStation): NewGasStation => {
  return {
    'Nom de Station': station['Nom de Station'],
    'Raison sociale': station['Raison sociale'],
    'Marque': station['Marque'],
    'Propriétaire': station['Propriétaire'],
    'Gérant': station['Gérant'],
    'CIN Gérant': station['CIN Gérant'],
    'Adesse': station['Adesse'],
    'Latitude': String(station['Latitude'] ?? ''),
    'Longitude': String(station['Longitude'] ?? ''),
    'Commune': station['Commune'],
    'Province': station['Province'],
    'Type': station['Type'],
    'Type Autorisation': station['Type Autorisation'],
    'Date Creation': formatDateToInput(station['Date Creation']),
    'numéro de création': station['numéro de création'],
    'Date Mise en service': formatDateToInput(station['Date Mise en service']),
    'numéro de Mise en service': station['numéro de Mise en service'],
    'Capacité Gasoil': String(station['Capacité Gasoil'] ?? ''),
    'Capacité SSP': String(station['Capacité SSP'] ?? ''),
    'numéro de Téléphone': station['numéro de Téléphone'],
  };
};


export function useStationForm({ mode, initialData, onSuccess }: UseStationFormProps) {
  const { createStation, updateStation } = useStationCRUD();
  
  const [formData, setFormData] = useState<NewGasStation>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(transformStationToForm(initialData));
    } else {
      setFormData(initialFormData);
    }
  }, [mode, initialData]);

  const updateField = useCallback((key: keyof NewGasStation, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
    // Clear the specific error for the field being updated
    if (errors[key as keyof FormErrors]) {
        setErrors(prev => ({
            ...prev,
            [key]: undefined
        }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const validation = validateStationData(formData);
    const formErrors: FormErrors = {};
    if (!validation.isValid) {
      // Map validation errors back to specific form fields
      if (validation.errors.includes('Station name is required')) formErrors['Nom de Station'] = 'Station Name is required';
      if (validation.errors.includes('Address is required')) formErrors['Adesse'] = 'Address is required';
      if (validation.errors.includes('Province is required')) formErrors['Province'] = 'Province is required';
      if (validation.errors.includes('Manager is required')) formErrors['Gérant'] = 'Manager is required';
      if (validation.errors.includes('Creation number is required')) formErrors['numéro de création'] = 'Creation number is required';
      if (validation.errors.includes('Service number is required')) formErrors['numéro de Mise en service'] = 'Service number is required';
      if (validation.errors.includes('Latitude must be a valid number between -90 and 90')) formErrors['Latitude'] = 'Invalid Latitude';
      if (validation.errors.includes('Longitude must be a valid number between -180 and 180')) formErrors['Longitude'] = 'Invalid Longitude';
      if (validation.errors.includes('Gasoil capacity must be a valid positive number')) formErrors['Capacité Gasoil'] = 'Invalid capacity';
      if (validation.errors.includes('SSP capacity must be a valid positive number')) formErrors['Capacité SSP'] = 'Invalid capacity';
      setErrors(formErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (mode === 'create') {
        await createStation(formData);
      } else if (mode === 'edit' && initialData) {
        await updateStation(initialData.id, formData);
      }
      
      onSuccess();
      
      // Reset form for create mode
      if (mode === 'create') {
        setFormData(initialFormData);
      }
      
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} station:`, error);
      setErrors({
        submit: error instanceof Error 
          ? error.message 
          : `Failed to ${mode === 'create' ? 'create' : 'update'} station. Please try again.`
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, mode, initialData, createStation, updateStation, onSuccess, validateForm]);

  const resetForm = useCallback(() => {
    if (mode === 'edit' && initialData) {
      setFormData(transformStationToForm(initialData));
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [mode, initialData]);

  const isValid = useMemo(() => {
    // Check if required fields have any value
    const hasRequiredFields = 
        (formData['Nom de Station']?.trim().length > 0) &&
        (formData['Adesse']?.trim().length > 0) &&
        (formData['Province']?.trim().length > 0) &&
        (formData['Gérant']?.trim().length > 0) &&
        (formData['numéro de création']?.trim().length > 0) &&
        (formData['numéro de Mise en service']?.trim().length > 0) &&
        (formData['Date Creation']?.trim().length > 0) &&
        (formData['Date Mise en service']?.trim().length > 0) &&
        (formData['Capacité Gasoil']?.trim().length > 0) &&
        (formData['Capacité SSP']?.trim().length > 0);

    const hasNoErrors = Object.keys(errors).length === 0;
    
    return hasRequiredFields && hasNoErrors;
  }, [formData, errors]);

  return {
    formData,
    errors,
    isSubmitting,
    isValid,
    updateField,
    handleSubmit,
    resetForm,
  };
}