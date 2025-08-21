'use client';

import { useState, useCallback, useEffect } from 'react';
import { GasStation, NewGasStation } from '@/types/station';
import { useStationCRUD } from '@/hooks/useStationCRUD';
import { validateStationData } from '@/lib/validations/stationValidation';
import { transformStationToForm } from '@/lib/utils/stationTransformers';

interface UseStationFormProps {
  mode: 'create' | 'edit';
  initialData?: GasStation;
  onSuccess: () => void;
}

interface FormErrors {
  name?: string;
  address?: string;
  city?: string;
  brand?: string;
  latitude?: string;
  longitude?: string;
  dieselPrice?: string;
  gasoline95Price?: string;
  openHours?: string;
  submit?: string;
}

const initialFormData: NewGasStation = {
  name: '',
  address: '',
  brand: '',
  city: '',
  latitude: '',
  longitude: '',
  openHours: '24/7',
  dieselPrice: '',
  gasoline95Price: '',
  fuelTypes: [],
  services: [],
  hasShop: false
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

  // Update individual field
  const updateField = useCallback((field: keyof NewGasStation, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Validate form data
  const validateForm = useCallback(() => {
    const validation = validateStationData(formData);
    
    if (!validation.isValid) {
      const newErrors: FormErrors = {};
      
      validation.errors.forEach(error => {
        if (error.includes('name')) newErrors.name = error;
        else if (error.includes('address')) newErrors.address = error;
        else if (error.includes('city')) newErrors.city = error;
        else if (error.includes('brand')) newErrors.brand = error;
        else if (error.includes('latitude')) newErrors.latitude = error;
        else if (error.includes('longitude')) newErrors.longitude = error;
        else if (error.includes('diesel')) newErrors.dieselPrice = error;
        else if (error.includes('gasoline')) newErrors.gasoline95Price = error;
        else if (error.includes('hours')) newErrors.openHours = error;
        else newErrors.submit = error;
      });
      
      setErrors(newErrors);
      return false;
    }
    
    setErrors({});
    return true;
  }, [formData]);

  // Check if form is valid
  const isValid = useCallback(() => {
    const hasRequiredFields = !!(
      formData.name.trim() && 
      formData.address.trim() && 
      formData.city.trim()
    );
    
    const hasNoErrors = Object.keys(errors).length === 0;
    
    return hasRequiredFields && hasNoErrors;
  }, [formData, errors]);

  // Handle form submission
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

  // Reset form
  const resetForm = useCallback(() => {
    if (mode === 'edit' && initialData) {
      setFormData(transformStationToForm(initialData));
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [mode, initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    isValid: isValid(),
    updateField,
    handleSubmit,
    resetForm,
    validateForm
  };
}