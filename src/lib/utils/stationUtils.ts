import { GasStation } from '@/types/station';

export function extractUniqueProvinces(stations: GasStation[]): string[] {
  const provinces = new Set<string>();
  stations.forEach(s => {
    const v = s['Province']?.trim();
    if (v) provinces.add(v);
  });
  return Array.from(provinces).sort((a, b) => a.localeCompare(b, 'fr'));
}

export function extractUniqueBrands(stations: GasStation[]): string[] {
  const brands = new Set<string>();
  stations.forEach(s => {
    const v = s['Marque']?.trim();
    if (v) brands.add(v);
  });
  return Array.from(brands).sort((a, b) => a.localeCompare(b, 'fr'));
}

export function formatCapacity(capacity: number | null | undefined): string {
  if (capacity === null || capacity === undefined) return 'N/A';
  return `${capacity.toLocaleString('fr-FR')} L`;
}

export function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  return date.toLocaleDateString('fr-FR');
}