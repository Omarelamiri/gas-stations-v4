// File: src/hooks/useStationCRUD.ts
// CRUD operations are updated to use the new collection name and
// the new data transformers.

'use client';

import { useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/auth/provider';
import { GasStation, NewGasStation } from '@/types/station';
import { 
  transformNewStationToFirestore, 
  transformStationForUpdate 
} from '@/lib/utils/stationTransformers';
import { validateStationData } from '@/lib/validations/stationValidation';

export function useStationCRUD() {
  const { currentUser } = useAuth();
  const collectionName = 'gas-stations';

  const createStation = useCallback(async (stationData: NewGasStation): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');

    // Validate data
    const validation = validateStationData(stationData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Transform data for Firestore
    const firestoreData = transformNewStationToFirestore(stationData, currentUser.uid);

    try {
      await addDoc(collection(db, collectionName), firestoreData);
    } catch (error) {
      console.error('Error creating station:', error);
      throw new Error('Failed to create station. Please try again.');
    }
  }, [currentUser]);

  const updateStation = useCallback(async (
    stationId: string, 
    stationData: Partial<NewGasStation>
  ): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');

    // Validate data if provided
    if (Object.keys(stationData).length > 0) {
      const validation = validateStationData(stationData, false); // Partial validation
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }
    }

    // Transform data for Firestore
    const firestoreData = transformStationForUpdate(stationData);

    try {
      await updateDoc(doc(db, collectionName, stationId), firestoreData);
    } catch (error) {
      console.error('Error updating station:', error);
      throw new Error('Failed to update station. Please try again.');
    }
  }, [currentUser]);

  const deleteStation = useCallback(async (stationId: string): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    if (!stationId) throw new Error('Station ID is required');

    try {
      await deleteDoc(doc(db, collectionName, stationId));
    } catch (error) {
      console.error('Error deleting station:', error);
      throw new Error('Failed to delete station. Please try again.');
    }
  }, [currentUser]);

  return {
    createStation,
    updateStation,
    deleteStation,
  };
}