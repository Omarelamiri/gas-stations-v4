// File: src/lib/utils/stationTransformers.ts
// New file to handle data transformation between form data and Firestore format.
// This is crucial for correctly saving and updating data with the new fields.

import { GasStation, NewGasStation } from '@/types/station';
import { FieldValue, serverTimestamp } from 'firebase/firestore';

// Define a type for Firestore data that includes timestamps
type FirestoreGasStation = Omit<GasStation, 'id' | 'Date Creation' | 'Date Mise en service'> & {
  'Date Creation': Date | FieldValue;
  'Date Mise en service': Date | FieldValue;
};

// Converts the form data into the format expected by Firestore for creation.
export function transformNewStationToFirestore(data: NewGasStation, createdBy: string): FirestoreGasStation {
  return {
    'Raison sociale': data['Raison sociale'],
    'Marque': data['Marque'],
    'Nom de Station': data['Nom de Station'],
    'Propriétaire': data['Propriétaire'],
    'Gérant': data['Gérant'],
    'CIN Gérant': data['CIN Gérant'],
    'Adesse': data['Adesse'],
    'Latitude': parseFloat(data['Latitude']),
    'Longitude': parseFloat(data['Longitude']),
    'Commune': data['Commune'],
    'Province': data['Province'],
    'Type': data['Type'],
    'Type Autorisation': data['Type Autorisation'],
    'Date Creation': new Date(data['Date Creation']),
    'numéro de création': data['numéro de création'],
    'Date Mise en service': new Date(data['Date Mise en service']),
    'numéro de Mise en service': data['numéro de Mise en service'],
    'Capacité Gasoil': parseFloat(data['Capacité Gasoil']),
    'Capacité SSP': parseFloat(data['Capacité SSP']),
    'numéro de Téléphone': data['numéro de Téléphone'],
  };
}

// Converts form data for an update operation.
export function transformStationForUpdate(data: Partial<NewGasStation>): Partial<FirestoreGasStation> {
  const firestoreData: Partial<FirestoreGasStation> = {};

  if (data['Raison sociale'] !== undefined) firestoreData['Raison sociale'] = data['Raison sociale'];
  if (data['Marque'] !== undefined) firestoreData['Marque'] = data['Marque'];
  if (data['Nom de Station'] !== undefined) firestoreData['Nom de Station'] = data['Nom de Station'];
  if (data['Propriétaire'] !== undefined) firestoreData['Propriétaire'] = data['Propriétaire'];
  if (data['Gérant'] !== undefined) firestoreData['Gérant'] = data['Gérant'];
  if (data['CIN Gérant'] !== undefined) firestoreData['CIN Gérant'] = data['CIN Gérant'];
  if (data['Adesse'] !== undefined) firestoreData['Adesse'] = data['Adesse'];
  if (data['Commune'] !== undefined) firestoreData['Commune'] = data['Commune'];
  if (data['Province'] !== undefined) firestoreData['Province'] = data['Province'];
  if (data['Type'] !== undefined) firestoreData['Type'] = data['Type'];
  if (data['Type Autorisation'] !== undefined) firestoreData['Type Autorisation'] = data['Type Autorisation'];
  if (data['numéro de création'] !== undefined) firestoreData['numéro de création'] = data['numéro de création'];
  if (data['numéro de Mise en service'] !== undefined) firestoreData['numéro de Mise en service'] = data['numéro de Mise en service'];
  if (data['numéro de Téléphone'] !== undefined) firestoreData['numéro de Téléphone'] = data['numéro de Téléphone'];
  
  // Convert number fields
  if (data['Latitude'] !== undefined && !isNaN(parseFloat(data['Latitude']))) {
    firestoreData['Latitude'] = parseFloat(data['Latitude']);
  }
  if (data['Longitude'] !== undefined && !isNaN(parseFloat(data['Longitude']))) {
    firestoreData['Longitude'] = parseFloat(data['Longitude']);
  }
  if (data['Capacité Gasoil'] !== undefined && !isNaN(parseFloat(data['Capacité Gasoil']))) {
    firestoreData['Capacité Gasoil'] = parseFloat(data['Capacité Gasoil']);
  }
  if (data['Capacité SSP'] !== undefined && !isNaN(parseFloat(data['Capacité SSP']))) {
    firestoreData['Capacité SSP'] = parseFloat(data['Capacité SSP']);
  }

  // Convert date fields
  if (data['Date Creation'] !== undefined && data['Date Creation'].trim() !== '') {
    firestoreData['Date Creation'] = new Date(data['Date Creation']);
  }
  if (data['Date Mise en service'] !== undefined && data['Date Mise en service'].trim() !== '') {
    firestoreData['Date Mise en service'] = new Date(data['Date Mise en service']);
  }

  return firestoreData;
}