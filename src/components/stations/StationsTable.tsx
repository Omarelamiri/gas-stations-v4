import React from 'react';
import { GasStation } from '@/types/station';
import Button from '@/components/ui/Button';
import { formatCapacity, formatDate } from '@/lib/utils/stationUtils';

interface StationsTableProps {
  stations: GasStation[];
  onEdit: (station: GasStation) => void;
  onDelete: (station: GasStation) => void;
}

export function StationsTable({ stations, onEdit, onDelete }: StationsTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-3 py-2 text-left">Nom de Station</th>
            <th className="px-3 py-2 text-left">Marque</th>
            <th className="px-3 py-2 text-left">Gérant</th>
            <th className="px-3 py-2 text-left">Téléphone</th>
            <th className="px-3 py-2 text-left">Province</th>
            <th className="px-3 py-2 text-left">Mise en service</th>
            <th className="px-3 py-2 text-left">SSP</th>
            <th className="px-3 py-2 text-left">Gasoil</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="px-3 py-2">{s['Nom de Station']}</td>
              <td className="px-3 py-2">{s['Marque']}</td>
              <td className="px-3 py-2">{s['Gérant']}</td>
              <td className="px-3 py-2">{s['numéro de Téléphone']}</td>
              <td className="px-3 py-2">{s['Province']}</td>
              <td className="px-3 py-2">{formatDate(s['Date Mise en service'])}</td>
              <td className="px-3 py-2">{formatCapacity(s['Capacité SSP'])}</td>
              <td className="px-3 py-2">{formatCapacity(s['Capacité Gasoil'])}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2 justify-end">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(s)}>Modifier</Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(s)}>Supprimer</Button>
                </div>
              </td>
            </tr>
          ))}
          {stations.length === 0 && (
            <tr>
              <td colSpan={9} className="px-3 py-8 text-center text-gray-500">Aucune station</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}