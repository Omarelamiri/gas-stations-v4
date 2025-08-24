'use client';
import { GasStation } from '@/types/station';
import Button from '@/components/ui/Button';

interface Props {
  rows: GasStation[];
  onEdit?: (row: GasStation) => void;
  onDelete?: (row: GasStation) => void;
}

export default function StationsTable({ rows, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left">Nom</th>
            <th className="px-3 py-2 text-left">Marque</th>
            <th className="px-3 py-2 text-left">Commune</th>
            <th className="px-3 py-2 text-left">Province</th>
            <th className="px-3 py-2 text-left">Type</th>
            <th className="px-3 py-2 text-right">Gasoil</th>
            <th className="px-3 py-2 text-right">SSP</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-3 py-2">{r['Nom de Station']}</td>
              <td className="px-3 py-2">{r['Marque']}</td>
              <td className="px-3 py-2">{r['Commune']}</td>
              <td className="px-3 py-2">{r['Province']}</td>
              <td className="px-3 py-2">{r['Type']}</td>
              <td className="px-3 py-2 text-right">{r['Capacité Gasoil'] ?? '-'}</td>
              <td className="px-3 py-2 text-right">{r['Capacité SSP'] ?? '-'}</td>
              <td className="px-3 py-2">
                <div className="flex gap-2 justify-center">
                  {onEdit && <Button size="sm" onClick={() => onEdit(r)}>Edit</Button>}
                  {onDelete && <Button size="sm" variant="danger" onClick={() => onDelete(r)}>Delete</Button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}