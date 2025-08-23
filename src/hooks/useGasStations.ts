// File: src/hooks/useGasStations.ts
// The data fetching hook is updated to use the new Firestore collection name
// and to map the incoming data to the new GasStation type.

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
        console.log("Forcing data refetch...");
    }, []);

    useEffect(() => {
        const q = query(
            collection(db, "gas-stations"), 
            orderBy("Date Creation", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const fetchedStations: GasStation[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Safely map data from Firestore to the GasStation type
                fetchedStations.push({
                    id: doc.id,
                    'Raison sociale': data['Raison sociale'] || '',
                    'Marque': data['Marque'] || 'Unknown Brand',
                    'Nom de Station': data['Nom de Station'] || 'Unknown Station',
                    'Propriétaire': data['Propriétaire'] || '',
                    'Gérant': data['Gérant'] || '',
                    'CIN Gérant': data['CIN Gérant'] || '',
                    'Adesse': data['Adesse'] || 'No address',
                    'Latitude': data['Latitude'] ?? 0,
                    'Longitude': data['Longitude'] ?? 0,
                    'Commune': data['Commune'] || '',
                    'Province': data['Province'] || 'Unknown Province',
                    'Type': data['Type'] || 'service',
                    'Type Autorisation': data['Type Autorisation'] || 'création',
                    'Date Creation': data['Date Creation']?.toDate() || new Date(),
                    'numéro de création': data['numéro de création'] || '',
                    'Date Mise en service': data['Date Mise en service']?.toDate() || new Date(),
                    'numéro de Mise en service': data['numéro de Mise en service'] || '',
                    'Capacité Gasoil': data['Capacité Gasoil'] ?? 0,
                    'Capacité SSP': data['Capacité SSP'] ?? 0,
                    'numéro de Téléphone': data['numéro de Téléphone'] || '',
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

        return () => unsubscribe();
    }, []);

    return { stations, loading, error, refetch };
};