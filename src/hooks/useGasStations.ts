'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GasStation } from '@/types/station';
import { docToStation } from '@/lib/utils/stationTransformers';


const COLLECTION = 'stations';


export function useGasStations() {
const [stations, setStations] = useState<GasStation[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);


const refresh = useCallback(() => {
setLoading(true);
const q = query(collection(db, COLLECTION), orderBy('Nom de Station'));
const unsub = onSnapshot(
q,
(snap) => {
const rows: GasStation[] = snap.docs.map((d) => docToStation(d.id, d.data()));
setStations(rows);
setLoading(false);
},
(err) => {
console.error(err);
setError(err.message);
setLoading(false);
}
);
return unsub;
}, []);


useEffect(() => {
const unsub = refresh();
return () => unsub && unsub();
}, [refresh]);


return { stations, loading, error, refresh };
}