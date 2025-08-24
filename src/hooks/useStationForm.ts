'use client';
import { useCallback, useMemo, useState } from 'react';
import { GasStation, GasStationFormData } from '@/types/station';
import { FormErrors, validateStationData } from '@/lib/validations/stationValidation';
import { stationToFormData } from '@/lib/utils/stationTransformers';
import { useStationCRUD } from './useStationCRUD';

export function useStationForm(initial?: GasStation) {
  const { createStation, updateStation } = useStationCRUD();

  const [formData, setFormData] = useState<GasStationFormData>(() =>
    initial ? stationToFormData(initial) : {
      'Raison sociale': '',
      'Marque': '',
      'Nom de Station': '',
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
    }
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setField = useCallback(<K extends keyof GasStationFormData>(key: K, value: GasStationFormData[K]) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }, []);

  const validate = useCallback(() => {
    const { isValid, errors } = validateStationData(formData);
    setErrors(errors);
    return isValid;
  }, [formData]);

  const submitCreate = useCallback(async () => {
    setSubmitting(true);
    try {
      if (!validate()) return null;
      const id = await createStation(formData);
      return id;
    } catch (e: any) {
      setErrors((prev) => ({ ...prev, submit: e?.message ?? 'Erreur inconnue' }));
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [createStation, formData, validate]);

  const submitUpdate = useCallback(async (id: string) => {
    setSubmitting(true);
    try {
      if (!validate()) return false;
      await updateStation(id, formData);
      return true;
    } catch (e: any) {
      setErrors((prev) => ({ ...prev, submit: e?.message ?? 'Erreur inconnue' }));
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [formData, updateStation, validate]);

  return { formData, setField, errors, submitting, submitCreate, submitUpdate };
}