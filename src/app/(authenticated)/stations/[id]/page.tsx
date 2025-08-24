'use client';
import { useEffect, useState } from 'react';
import StationForm from '@/components/stations/StationForm';
import { useStationCRUD } from '@/hooks/useStationCRUD';
import { GasStation } from '@/types/station';

export default function GasStationDetail({ params }: { params: { id: string } }) {
  const { getStation } = useStationCRUD();
  const [station, setStation] = useState<GasStation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await getStation(params.id);
      setStation(s);
      setLoading(false);
    })();
  }, [getStation, params.id]);

  if (loading) return <div className="p-6">Chargement…</div>;
  if (!station) return <div className="p-6">Station introuvable</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Modifier la station</h1>
      <StationForm mode="edit" station={station} />
    </div>
  );
}