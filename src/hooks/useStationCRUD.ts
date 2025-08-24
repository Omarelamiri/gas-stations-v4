'use client';
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GasStation, GasStationFormData } from '@/types/station';
import { docToStation, formDataToFirestore } from '@/lib/utils/stationTransformers';

const COLLECTION = 'stations';

export function useStationCRUD() {
  async function createStation(data: GasStationFormData): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION), formDataToFirestore(data));
    return ref.id;
  }

  async function updateStation(id: string, data: GasStationFormData): Promise<void> {
    await setDoc(doc(db, COLLECTION, id), formDataToFirestore(data), { merge: true });
  }

  async function deleteStation(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  async function getStation(id: string): Promise<GasStation | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return docToStation(snap.id, snap.data()!);
  }

  return { createStation, updateStation, deleteStation, getStation };
}
