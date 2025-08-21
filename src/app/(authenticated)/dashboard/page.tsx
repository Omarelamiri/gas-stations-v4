'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { StationFilters } from '@/components/dashboard/StationFilters';
import { MapPreview } from '@/components/dashboard/MapPreview';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export default function DashboardPage() {
  const {
    stats,
    filteredStations,
    availableCities,
    selectedCities,
    loading,
    error,
    actions: {
      updateCityFilter,
      selectAllCities,
      clearAllCities
    }
  } = useDashboardData();

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
        <ErrorMessage error={error} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your gas stations</p>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Filters */}
      <StationFilters
        availableCities={availableCities}
        selectedCities={selectedCities}
        onCityChange={updateCityFilter}
        onSelectAll={selectAllCities}
        onClearAll={clearAllCities}
      />

      {/* Map Preview */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Station Locations</h2>
        </div>
        <div className="h-[400px]">
          <MapPreview stations={filteredStations} />
        </div>
      </div>
    </div>
  );
}