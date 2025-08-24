'use client';
import StationForm from '@/components/stations/StationForm';
import { useRouter } from 'next/navigation';

export default function NewGasStation() {
  const router = useRouter();
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Créer une station</h1>
      <StationForm mode="create" onSaved={(id) => router.push(`/stations/${id}`)} />
    </div>
  );
}