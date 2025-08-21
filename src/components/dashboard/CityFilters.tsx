
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function CityFilters() {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'stations'), snapshot => {
      const citySet = new Set<string>();
      snapshot.forEach(doc => citySet.add(doc.data().city));
      setCities(Array.from(citySet));
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex gap-4">
      {cities.map(city => (
        <label key={city} className="flex items-center gap-2">
          <input type="checkbox" className="accent-blue-600" />
          {city}
        </label>
      ))}
    </div>
  );
}
