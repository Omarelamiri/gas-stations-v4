"use client";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { GasStation } from "@/types/station"; // Import from new types file

export const useGasStations = () => {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "gasStations"),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedStations: GasStation[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        // Robust parsing for prices, ensuring only numbers are included
        const cleanPrices: Record<string, number> = {};
        if (data.prices && typeof data.prices === 'object') {
          Object.entries(data.prices).forEach(([key, value]) => {
            if (typeof value === 'number') {
              cleanPrices[key] = value;
            }
          });
        }

        fetchedStations.push({
          id: doc.id,
          name: data.name || 'Unknown Station',
          address: data.address || 'No address',
          brand: data.brand || 'Unknown Brand',
          city: data.city || 'Unknown City',
          fuelTypes: data.fuelTypes || [],
          hasShop: data.hasShop || false,
          location: {
            latitude: data.location?.latitude || 0,
            longitude: data.location?.longitude || 0
          },
          openHours: data.openHours || '24/7',
          prices: cleanPrices,
          services: data.services || [],
          updatedAt: data.updatedAt,
        });
      });
      setStations(fetchedStations);
      setLoading(false);
      setError(null); // Clear any previous errors on successful fetch
    }, (err) => {
      console.error("Error fetching gas stations:", err);
      setError("Failed to load gas stations.");
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return { stations, loading, error };
};