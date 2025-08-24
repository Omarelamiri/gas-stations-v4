'use client';

import { useStationsTable } from '@/hooks/useStationsTable';
import  StationsTable  from '@/components/stations/StationsTable';
import  StationForm  from '@/components/stations/StationForm';
import { TableActions } from '@/components/stations/TableActions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Modal } from '@/components/ui/Modal';

export default function StationsPage() {
  const {
    stations,
    loading,
    error,
    ui: {
      showAddForm,
      selectedStation,
      searchQuery,
      sortConfig,
      currentPage,
      itemsPerPage
    },
    actions: {
      openAddForm,
      closeAddForm,
      openEditForm,
      closeEditForm,
      setSearchQuery,
      setSortConfig,
      setCurrentPage,
      deleteStation,
      refreshStations
    }
  } = useStationsTable();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage error={error} onRetry={refreshStations} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gas Stations</h1>
          <p className="text-gray-600">Manage your gas stations database</p>
        </div>
      </div>

      {/* Table Actions */}
      <TableActions
        onAddNew={openAddForm}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalStations={stations.length}
        onRefresh={refreshStations}
      />

      {/* Stations Table */}
      <StationsTable
        stations={stations}
        searchQuery={searchQuery}
        sortConfig={sortConfig}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onSort={setSortConfig}
        onPageChange={setCurrentPage}
        onEdit={openEditForm}
        onDelete={deleteStation}
      />

      {/* Add Station Modal */}
      {showAddForm && (
        <Modal
          isOpen={showAddForm}
          onClose={closeAddForm}
          title="Add New Gas Station"
        >
          <StationForm
            mode="create"
            onSuccess={closeAddForm}
            onCancel={closeAddForm}
          />
        </Modal>
      )}

      {/* Edit Station Modal */}
      {selectedStation && (
        <Modal
          isOpen={!!selectedStation}
          onClose={closeEditForm}
          title="Edit Gas Station"
        >
          <StationForm
            mode="edit"
            station={selectedStation}
            onSuccess={closeEditForm}
            onCancel={closeEditForm}
          />
        </Modal>
      )}
    </div>
  );
}