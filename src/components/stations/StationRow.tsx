// StationRow.tsx
'use client';

import { useState } from 'react';
import { GasStation } from '@/types/station';
import { TableColumn } from '@/types/table';
import  Button  from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface StationRowProps {
  station: GasStation;
  columns: TableColumn[];
  onEdit: (station: GasStation) => void;
  onDelete: (id: string) => Promise<void>;
}

export function StationRow({ station, columns, onEdit, onDelete }: StationRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(station.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting station:', error);
      // TODO: Show error toast
    } finally {
      setIsDeleting(false);
    }
  };

  const getCellValue = (column: TableColumn) => {
    if (column.key === 'actions') {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(station)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </Button>
        </div>
      );
    }

    let value: any;
    if (column.key.includes('.')) {
        const keys = column.key.split('.');
        value = keys.reduce((obj: Record<string, any>, key: string) => obj?.[key], station as Record<string, any>);
    } else {
        value = station[column.key as keyof GasStation];
    }

    if (column.render) {
      return column.render(value, station);
    }

    return value || 'N/A';
  };

  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer">
        {columns.map((column) => (
          <td
            key={column.key}
            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            {getCellValue(column)}
          </td>
        ))}
      </tr>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Gas Station"
        message={`Are you sure you want to delete "${station.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}