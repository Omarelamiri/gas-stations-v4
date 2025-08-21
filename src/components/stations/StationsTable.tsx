'use client';

import { useMemo } from 'react';
import { GasStation } from '@/types/station';
import { SortConfig, TableColumn, PaginationInfo } from '@/types/table';
import { StationRow } from './StationRow';
import { TableHeader } from './TableHeader';
import { TablePagination } from './TablePagination';
import { EmptyState } from './EmptyState';
import { 
  filterStations, 
  sortStations, 
  paginateResults 
} from '@/lib/utils/tableUtils';
import { formatPrice } from '@/lib/utils/stationUtils';

interface StationsTableProps {
  stations: GasStation[];
  searchQuery: string;
  sortConfig: SortConfig;
  currentPage: number;
  itemsPerPage: number;
  onSort: (config: SortConfig) => void;
  onPageChange: (page: number) => void;
  onEdit: (station: GasStation) => void;
  onDelete: (id: string) => Promise<void>;
}

export function StationsTable({
  stations,
  searchQuery,
  sortConfig,
  currentPage,
  itemsPerPage,
  onSort,
  onPageChange,
  onEdit,
  onDelete
}: StationsTableProps) {
  
  // Define table columns
  const columns: TableColumn[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: 'w-1/5'
    },
    {
      key: 'brand',
      label: 'Brand',
      sortable: true,
      width: 'w-32'
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
      width: 'w-32'
    },
    {
      key: 'prices.diesel',
      label: 'Diesel',
      sortable: true,
      width: 'w-24',
      render: (value) => formatPrice(value)
    },
    {
      key: 'prices.gasoline95',
      label: 'Gasoline 95',
      sortable: true,
      width: 'w-28',
      render: (value) => formatPrice(value)
    },
    {
      key: 'hasShop',
      label: 'Shop',
      sortable: true,
      width: 'w-20',
      render: (value) => value ? '✓' : '✗'
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      width: 'w-32'
    }
  ];

  // Process data with memoization
  const processedData = useMemo(() => {
    // Filter stations based on search query
    let filtered = filterStations(stations, searchQuery);
    
    // Sort filtered results
    let sorted = sortStations(filtered, sortConfig);
    
    // Calculate pagination info
    const paginationInfo: PaginationInfo = {
      currentPage,
      totalItems: sorted.length,
      itemsPerPage,
      totalPages: Math.ceil(sorted.length / itemsPerPage),
      startIndex: (currentPage - 1) * itemsPerPage,
      endIndex: Math.min(currentPage * itemsPerPage, sorted.length)
    };
    
    // Get paginated results
    const paginated = paginateResults(sorted, currentPage, itemsPerPage);
    
    return {
      stations: paginated,
      pagination: paginationInfo,
      hasResults: sorted.length > 0,
      hasSearch: searchQuery.trim().length > 0
    };
  }, [stations, searchQuery, sortConfig, currentPage, itemsPerPage]);

  const {
    stations: paginatedStations,
    pagination,
    hasResults,
    hasSearch
  } = processedData;

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const newDirection = 
      sortConfig.key === columnKey && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    onSort({
      key: columnKey,
      direction: newDirection
    });
  };

  // Show empty state if no results
  if (!hasResults) {
    return (
      <EmptyState 
        hasSearch={hasSearch}
        searchQuery={searchQuery}
        totalStations={stations.length}
      />
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Stations ({pagination.totalItems})
          </h2>
          <div className="text-sm text-gray-500">
            Showing {pagination.startIndex + 1}-{pagination.endIndex} of {pagination.totalItems}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <TableHeader 
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedStations.map((station) => (
              <StationRow
                key={station.id}
                station={station}
                columns={columns}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <TablePagination 
            pagination={pagination}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}