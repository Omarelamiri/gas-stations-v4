'use client';

import { useMemo, useState, useEffect } from 'react';
import { useGasStations } from '@/hooks/useGasStations';
import { useAuth } from '@/lib/auth/provider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import MapPreview from '@/components/dashboard/MapPreview';
import { GasStation } from '@/types/station';

function formatCapacity(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' L';
}

export default function DashboardPage() {
  const { stations, loading, error } = useGasStations();
  const { currentUser } = useAuth();

  // Add debug logging
  useEffect(() => {
    console.log('Dashboard Debug Info:');
    console.log('- Current user:', currentUser?.email);
    console.log('- Stations loading:', loading);
    console.log('- Stations error:', error);
    console.log('- Stations count:', stations.length);
    console.log('- First few stations:', stations.slice(0, 3));
    
    // Log each station's details
    stations.forEach((station, index) => {
      console.log(`Station ${index + 1}:`, {
        name: station['Nom de Station'],
        brand: station['Marque'],
        province: station['Province'],
        type: station['Type'],
        gasoil: station['Capacité Gasoil'],
        ssp: station['Capacité SSP']
      });
    });
  }, [stations, loading, error, currentUser]);

  // ----- Filters (by Province) -----
  const provinces = useMemo(() => {
    const set = new Set<string>();
    stations.forEach(s => {
      const province = s['Province'];
      if (province && province.trim()) {
        set.add(province.trim());
      }
    });
    const result = Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
    console.log('Available provinces:', result);
    return result;
  }, [stations]);

  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

  // Auto-select all provinces when they load
  useEffect(() => {
    if (provinces.length > 0 && selectedProvinces.length === 0) {
      setSelectedProvinces(provinces); // Select all provinces by default
    }
  }, [provinces, selectedProvinces.length]);

  const toggleProvince = (p: string, checked: boolean) => {
    setSelectedProvinces(prev =>
      checked ? Array.from(new Set([...prev, p])) : prev.filter(x => x !== p)
    );
  };

  const selectAll = () => setSelectedProvinces(provinces);
  const clearAll = () => setSelectedProvinces([]);

  // ----- Apply filters -----
  const filtered = useMemo(() => {
    if (selectedProvinces.length === 0) return stations; // Show all if none selected
    const set = new Set(selectedProvinces);
    const result = stations.filter(s => {
      const province = s['Province'];
      return province && set.has(province.trim());
    });
    console.log('Filtered stations:', result.length, 'out of', stations.length);
    return result;
  }, [stations, selectedProvinces]);

  // ----- Stats (Fixed) -----
  const stats = useMemo(() => {
    console.log('Calculating stats for', filtered.length, 'stations');
    
    const total = filtered.length;
    let service = 0;
    let remplissage = 0;
    let totalGasoil = 0;
    let totalSSP = 0;
    const brands = new Set<string>();

    filtered.forEach(s => {
      // Count types
      const type = s['Type'];
      if (type === 'service') service++;
      if (type === 'remplissage') remplissage++;
      
      // Sum capacities (handle both number and null values)
      const gasoil = s['Capacité Gasoil'];
      const ssp = s['Capacité SSP'];
      
      if (typeof gasoil === 'number' && gasoil > 0) {
        totalGasoil += gasoil;
      }
      if (typeof ssp === 'number' && ssp > 0) {
        totalSSP += ssp;
      }
      
      // Count unique brands
      const brand = s['Marque'];
      if (brand && brand.trim()) {
        brands.add(brand.trim());
      }
    });

    const result = {
      total,
      service,
      remplissage,
      totalGasoil,
      totalSSP,
      brandCount: brands.size,
    };
    
    console.log('Calculated stats:', result);
    return result;
  }, [filtered]);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Loading Dashboard...</h2>
        <LoadingSpinner />
        <div className="mt-4 text-sm text-gray-600">
          <p>User: {currentUser?.email}</p>
          <p>Attempting to load gas stations from Firestore...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Error Loading Dashboard</h2>
        <ErrorMessage message={error} />
        <div className="mt-4 text-sm text-gray-600">
          <p>User: {currentUser?.email}</p>
          <p>Check the browser console for more details.</p>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">No Data Found</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No gas stations found in the 'gasStations' collection. 
            Please check:
          </p>
          <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
            <li>Firebase collection name is 'gasStations'</li>
            <li>You have data in your Firestore database</li>
            <li>Firestore security rules allow reading</li>
            <li>Your authentication is working</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-gray-900">
      {/* Debug Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <h3 className="font-semibold text-blue-800">Debug Info:</h3>
        <div className="text-blue-700 mt-1">
          <p>User: {currentUser?.email}</p>
          <p>Total Stations: {stations.length}</p>
          <p>Provinces: {provinces.length} ({provinces.join(', ')})</p>
          <p>Selected Provinces: {selectedProvinces.length}</p>
          <p>Filtered Stations: {filtered.length}</p>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stations-service</h1>
        <p className="text-sm text-gray-600">Vue d'ensemble, filtres par province, et liste rapide.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Total stations</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Type: service</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.service}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Type: remplissage</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.remplissage}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Capacité Gasoil</div>
          <div className="text-2xl font-semibold text-gray-900">{formatCapacity(stats.totalGasoil)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Capacité SSP</div>
          <div className="text-2xl font-semibold text-gray-900">{formatCapacity(stats.totalSSP)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Marques distinctes</div>
          <div className="text-2xl font-semibold text-gray-900">{stats.brandCount}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtrer par province</h2>
          <div className="space-x-2">
            <Button variant="secondary" size="sm" onClick={selectAll}>Tout cocher</Button>
            <Button variant="secondary" size="sm" onClick={clearAll}>Tout décocher</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {provinces.map((p) => (
            <div key={p} className="flex items-center space-x-2">
              <Checkbox
                id={p}
                checked={selectedProvinces.includes(p)}
                onCheckedChange={(checked) => toggleProvince(p, checked)}
              >
                <span className="text-gray-900">{p}</span>
              </Checkbox>
            </div>
          ))}
        </div>
      </Card>

      {/* Map with actual MapPreview component */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Carte des stations</h2>
        <div className="h-96">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <MapPreview stations={filtered} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 bg-gray-100 rounded">
              <div className="text-center">
                <p>Google Maps API key not configured</p>
                <p className="text-sm mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Quick list */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stations filtrées ({filtered.length})</h2>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune station ne correspond aux filtres sélectionnés.</p>
            <div className="mt-2">
              <Button variant="secondary" size="sm" onClick={selectAll}>
                Afficher toutes les stations
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3 pr-4 font-medium">Nom</th>
                  <th className="py-3 pr-4 font-medium">Marque</th>
                  <th className="py-3 pr-4 font-medium">Province</th>
                  <th className="py-3 pr-4 font-medium">Commune</th>
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Gasoil (L)</th>
                  <th className="py-3 pr-4 font-medium">SSP (L)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map((s: GasStation) => (
                  <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-4 text-gray-900 font-medium">{s['Nom de Station']}</td>
                    <td className="py-3 pr-4 text-gray-700">{s['Marque']}</td>
                    <td className="py-3 pr-4 text-gray-700">{s['Province']}</td>
                    <td className="py-3 pr-4 text-gray-700">{s['Commune']}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        s['Type'] === 'service' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {s['Type']}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-700 text-right">
                      {s['Capacité Gasoil'] ? s['Capacité Gasoil'].toLocaleString() : '-'}
                    </td>
                    <td className="py-3 pr-4 text-gray-700 text-right">
                      {s['Capacité SSP'] ? s['Capacité SSP'].toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}