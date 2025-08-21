// useGasStations.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { GasStation } from "@/types/station";

export const useGasStations = () => {
    const [stations, setStations] = useState<GasStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(() => {
        // Since onSnapshot is a real-time listener, forcing a "refetch" isn't necessary for data
        // consistency. The hook will automatically update. However, to satisfy the `refetch`
        // dependency in other hooks, we can just log or manage a state.
        // A more complex implementation might detach the listener and re-attach it.
        // For simplicity, we can just manage the loading state.
        console.log("Forcing data refetch...");
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "gasStations"),
            orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedStations: GasStation[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();

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
            setError(null);
        }, (err) => {
            console.error("Error fetching gas stations:", err);
            setError("Failed to load gas stations.");
            setLoading(false);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    // Return the refetch function along with the data
    return { stations, loading, error, refetch };
};