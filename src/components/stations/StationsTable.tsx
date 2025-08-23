// File: src/components/stations/StationsTable.tsx
// The table component's column definitions are updated to match the new schema.

import React from 'react';
import { Table, TableBody, TableHeader, TableRow, TableCell } from '@/components/ui/Table';
import { useStationsTable } from '@/hooks/useStationsTable';
import { useDebounce } from '@/hooks/useDebounce';
import { GasStation } from '@/types/station';
import { formatDate } from '@/lib/utils/stationUtils';
import { LuPencil, LuTrash, LuListFilter, LuArrowUp, LuArrowDown } from 'react-icons/lu';
import  Button  from '@/components/ui/Button';
import  Card  from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { StationForm } from '@/components/stations/StationForm';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

// Table column definition
interface TableColumn {
  key: keyof GasStation | 'actions' | string;
  label: string;
  sortable: boolean;
  width: string;
}

const columns: TableColumn[] = [
  {
    key: 'Nom de Station',
    label: 'Station Name',
    sortable: true,
    width: 'w-1/5'
  },
  {
    key: 'Marque',
    label: 'Brand',
    sortable: true,
    width: 'w-32'
  },
  {
    key: 'Province',
    label: 'Province',
    sortable: true,
    width: 'w-32'
  },
  {
    key: 'Type',
    label: 'Type',
    sortable: true,
    width: 'w-24'
  },
  {
    key: 'Gérant',
    label: 'Manager',
    sortable: true,
    width: 'w-32'
  },
  {
    key: 'numéro de Téléphone',
    label: 'Phone',
    sortable: false,
    width: 'w-32'
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false,
    width: 'w-32'
  }
];

export function StationsTable() {
  const {
    state: { paginatedData, loading, error, ui },
    actions: { openAddForm, openEditForm, closeAddForm, closeEditForm, deleteStation, setSearchQuery, setSortConfig, setCurrentPage, refreshStations }
  } = useStationsTable();
  const debouncedSearch = useDebounce(ui.searchQuery, 300);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await deleteStation(id);
        // Data will automatically update via the Firestore snapshot listener
      } catch (err) {
        alert('Failed to delete station. Please try again.');
      }
    }
  };
  
  const renderRow = (station: GasStation) => (
    <TableRow key={station.id}>
      <TableCell className="font-medium text-gray-900">{station['Nom de Station']}</TableCell>
      <TableCell>{station['Marque']}</TableCell>
      <TableCell>{station['Province']}</TableCell>
      <TableCell>{station['Type']}</TableCell>
      <TableCell>{station['Gérant']}</TableCell>
      <TableCell>{station['numéro de Téléphone']}</TableCell>
      <TableCell className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openEditForm(station)}
          title="Edit"
        >
          <LuPencil />
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDelete(station.id)}
          title="Delete"
        >
          <LuTrash />
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="relative p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search stations..."
            value={ui.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-64"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            onClick={refreshStations}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={openAddForm}
          >
            Add Station
          </Button>
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading stations...</div>}
      {error && <ErrorMessage error={error} />}

      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.key}
                    className={`font-semibold text-gray-700 cursor-pointer ${column.width}`}
                    onClick={() => column.sortable && setSortConfig({
                      key: column.key,
                      direction: ui.sortConfig.key === column.key && ui.sortConfig.direction === 'asc' ? 'desc' : 'asc'
                    })}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        ui.sortConfig.key === column.key
                          ? (ui.sortConfig.direction === 'asc' ? <LuArrowUp /> : <LuArrowDown />)
                          : <LuListFilter className="text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map(renderRow)}
            </TableBody>
          </Table>
          
          {paginatedData.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No stations found.
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">
              Page {ui.currentPage}
            </span>
            <div className="space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(ui.currentPage - 1)}
                disabled={ui.currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(ui.currentPage + 1)}
                disabled={paginatedData.length < ui.itemsPerPage}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Station Modal */}
      <Modal
        title={ui.showAddForm ? 'Add New Station' : 'Edit Station'}
        isOpen={ui.showAddForm || !!ui.selectedStation}
        onClose={ui.showAddForm ? closeAddForm : closeEditForm}
      >
        <StationForm
          mode={ui.showAddForm ? 'create' : 'edit'}
          station={ui.selectedStation || undefined}
          onSuccess={ui.showAddForm ? closeAddForm : closeEditForm}
          onCancel={ui.showAddForm ? closeAddForm : closeEditForm}
        />
      </Modal>
    </Card>
  );
}