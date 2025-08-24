'use client';

import { useMemo, useState } from 'react';
import { useGasStations } from '@/hooks/useGasStations';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { GasStation } from '@/types/station';

function formatCapacity(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' L';
}

export default function DashboardPage() {
  const { stations, loading, error } = useGasStations();

  // ----- Filters (by Province) -----
  const provinces = useMemo(() => {
    const set = new Set<string>();
    stations.forEach(s => {
      if (s['Province']) set.add(s['Province']);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [stations]);

  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);

  const toggleProvince = (p: string, checked: boolean) => {
    setSelectedProvinces(prev =>
      checked ? Array.from(new Set([...prev, p])) : prev.filter(x => x !== p)
    );
  };

  const selectAll = () => setSelectedProvinces(provinces);
  const clearAll = () => setSelectedProvinces([]);

  // ----- Apply filters -----
  const filtered = useMemo(() => {
    if (selectedProvinces.length === 0) return stations;
    const set = new Set(selectedProvinces);
    return stations.filter(s => set.has(s['Province']));
  }, [stations, selectedProvinces]);

  // ----- Stats -----
  const stats = useMemo(() => {
    const total = filtered.length;
    let service = 0;
    let remplissage = 0;
    let totalGasoil = 0;
    let totalSSP = 0;
    const brands = new Set<string>();

    filtered.forEach(s => {
      if (s['Type'] === 'service') service++;
      if (s['Type'] === 'remplissage') remplissage++;
      if (typeof s['Capacité Gasoil'] === 'number') totalGasoil += s['Capacité Gasoil'];
      if (typeof s['Capacité SSP'] === 'number') totalSSP += s['Capacité SSP'];
      if (s['Marque']) brands.add(s['Marque']);
    });

    return {
      total,
      service,
      remplissage,
      totalGasoil,
      totalSSP,
      brandCount: brands.size,
    };
  }, [filtered]);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stations-service</h1>
        <p className="text-sm text-gray-600">Vue d’ensemble, filtres par province, et liste rapide.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-sm text-gray-500">Total stations</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Type: service</div>
          <div className="text-2xl font-semibold">{stats.service}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Type: remplissage</div>
          <div className="text-2xl font-semibold">{stats.remplissage}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Capacité Gasoil</div>
          <div className="text-2xl font-semibold">{formatCapacity(stats.totalGasoil)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Capacité SSP</div>
          <div className="text-2xl font-semibold">{formatCapacity(stats.totalSSP)}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500">Marques distinctes</div>
          <div className="text-2xl font-semibold">{stats.brandCount}</div>
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
                {p}
              </Checkbox>
            </div>
          ))}
        </div>
      </Card>

      {/* Map placeholder (you can re-insert your MapPreview when that file is complete) */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Carte</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Carte à insérer ici (MapPreview)
        </div>
      </Card>

      {/* Quick list */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Stations filtrées</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-4">Nom</th>
                <th className="py-2 pr-4">Marque</th>
                <th className="py-2 pr-4">Province</th>
                <th className="py-2 pr-4">Commune</th>
                <th className="py-2 pr-4">Type</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((s: GasStation) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="py-2 pr-4">{s['Nom de Station']}</td>
                  <td className="py-2 pr-4">{s['Marque']}</td>
                  <td className="py-2 pr-4">{s['Province']}</td>
                  <td className="py-2 pr-4">{s['Commune']}</td>
                  <td className="py-2 pr-4">{s['Type']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}