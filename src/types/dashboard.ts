import { GasStation } from './station';

export interface DashboardStats {
  total: {
    stations: number;
    filtered: number;
  };
  pricing: {
    avgDieselPrice: number | null;
    avgGasoline95Price: number | null;
  };
  breakdown: {
    brands: number;
    stationsWithShops: number;
    mostCommonFuelType: string | null;
  };
}

export interface StationFiltersState {
  availableCities: string[];
  selectedCities: string[];
}

export interface StationFiltersActions {
  updateCityFilter: (city: string, isSelected: boolean) => void;
  selectAllCities: () => void;
  clearAllCities: () => void;
}

export interface DashboardData {
  stats: DashboardStats;
  stations: GasStation[];
  filteredStations: GasStation[];
  availableCities: string[];
  selectedCities: string[];
  loading: boolean;
  error: string | null;
  actions: StationFiltersActions;
}