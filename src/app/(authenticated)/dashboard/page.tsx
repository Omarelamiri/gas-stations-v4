'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth'; // Only signOut needed here
import { doc, deleteDoc } from 'firebase/firestore'; // Only deleteDoc and doc needed
import { auth, db } from '@/lib/firebase/config';
import GasStationMap from '@/components/dashboard/GasStationMap';
import CityFilter from '@/components/dashboard/CityFilters';
import { useAuth } from '@/lib/auth/provider'; // Use the provided auth hook
import { useGasStations } from '@/hooks/useGasStations'; // Use the new gas stations hook
import { GasStation } from '@/types/station'; // Import GasStation interface

export default function Dashboard() {
  // Use useAuth hook for authentication state
  const { currentUser, loading: authLoading } = useAuth();
  // Use useGasStations hook for gas station data
  const { stations: gasStations, loading: stationsLoading, error: stationsError } = useGasStations();

  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>(['Rabat']); // Keep initial 'Rabat' selection
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [authLoading, currentUser, router]);

  // Populate available cities and ensure selected cities are valid
  useEffect(() => {
    if (gasStations.length > 0) {
      const cities = new Set<string>();
      gasStations.forEach(station => {
        if (station.city) {
          cities.add(station.city);
        }
      });
      const sortedCities = Array.from(cities).sort();
      setAvailableCities(sortedCities);

      // Adjust selectedCities if 'Rabat' is not available or if other initial logic is preferred
      // Ensure selectedCities only contains cities that are actually available
      setSelectedCities(prevSelected => {
        const validSelected = prevSelected.filter(city => sortedCities.includes(city));
        if (validSelected.length === 0 && sortedCities.includes('Rabat')) {
          return ['Rabat']; // Default to Rabat if previously selected cities are gone
        } else if (validSelected.length === 0 && sortedCities.length > 0) {
          return sortedCities; // If no valid selected cities, select all
        }
        return validSelected.length > 0 ? validSelected : sortedCities; // If no selected cities, select all available cities
      });
    } else {
      setAvailableCities([]);
      setSelectedCities([]);
    }
  }, [gasStations]);


  // Filter gas stations based on selected cities
  const filteredStations = gasStations.filter(station => selectedCities.includes(station.city));

  // Handle city checkbox change
  const handleCityChange = (city: string, isChecked: boolean) => {
    setSelectedCities(prevSelectedCities => {
      if (isChecked) {
        return [...prevSelectedCities, city];
      } else {
        return prevSelectedCities.filter(c => c !== city);
      }
    });
  };

  // Handle 'All' checkbox change
  const handleAllChange = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedCities(availableCities);
    } else {
      setSelectedCities([]);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Use Firebase auth directly
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Delete gas station
  const handleDeleteStation = async (id: string) => {
    if (confirm('Are you sure you want to delete this gas station?')) {
      try {
        await deleteDoc(doc(db, 'gasStations', id));
      } catch (error) {
        console.error('Error deleting gas station:', error);
        alert('Error deleting gas station. Please try again.');
      }
    }
  };

  // Combined loading state
  if (authLoading || stationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle authentication redirect early if no user
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Handle stations error
  if (stationsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600">{stationsError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Total Gas Stations</h2>
            <p className="mt-2 text-3xl font-bold text-blue-600">{filteredStations.length}</p>
          </div>

          <CityFilter
            cities={availableCities}
            selectedCities={selectedCities}
            onCityChange={handleCityChange}
            onAllChange={handleAllChange}
          />

          <div className="flex gap-6 h-[600px]">
            <div className="w-full border">
              {filteredStations.length > 0 ? (
                <GasStationMap stations={filteredStations} />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">No stations to display on map</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}