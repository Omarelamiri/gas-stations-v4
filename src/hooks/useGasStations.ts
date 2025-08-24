'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GasStation } from '@/types/station';
import { docToStation } from '@/lib/utils/stationTransformers';

const COLLECTION = 'stations'; // adjust if needed

export function useGasStations() {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    const q = query(collection(db, COLLECTION), orderBy('Nom de Station'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: GasStation[] = [];
        snap.forEach((d) => list.push(docToStation(d.id, d.data())));
        setStations(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('Failed to load stations');
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = refetch();
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [refetch]);

  return { stations, loading, error, refetch };
}