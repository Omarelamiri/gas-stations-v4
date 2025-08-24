'use client';
import { GasStation } from '@/types/station';
import { useStationForm } from '@/hooks/useStationForm';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface Props {
  mode: 'create' | 'edit';
  station?: GasStation;
  onSaved?: (id: string) => void;
}

export default function StationForm({ mode, station, onSaved }: Props) {
  const { formData, setField, errors, submitting, submitCreate, submitUpdate } = useStationForm(station);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      const id = await submitCreate();
      if (id && onSaved) onSaved(id);
    } else if (mode === 'edit' && station) {
      const ok = await submitUpdate(station.id);
      if (ok && onSaved) onSaved(station.id);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Raison sociale" value={formData['Raison sociale']} onChange={(e) => setField('Raison sociale', e.target.value)} error={errors['Raison sociale']} />
        <Input label="Marque" value={formData['Marque']} onChange={(e) => setField('Marque', e.target.value)} error={errors['Marque']} />
        <Input label="Nom de Station" value={formData['Nom de Station']} onChange={(e) => setField('Nom de Station', e.target.value)} error={errors['Nom de Station']} />
        <Input label="Propriétaire" value={formData['Propriétaire']} onChange={(e) => setField('Propriétaire', e.target.value)} error={errors['Propriétaire']} />
        <Input label="Gérant" value={formData['Gérant']} onChange={(e) => setField('Gérant', e.target.value)} error={errors['Gérant']} />
        <Input label="CIN Gérant" value={formData['CIN Gérant']} onChange={(e) => setField('CIN Gérant', e.target.value)} error={errors['CIN Gérant']} />
        <Input label="Adesse" value={formData['Adesse']} onChange={(e) => setField('Adesse', e.target.value)} error={errors['Adesse']} />
        <Input label="Commune" value={formData['Commune']} onChange={(e) => setField('Commune', e.target.value)} error={errors['Commune']} />
        <Input label="Province" value={formData['Province']} onChange={(e) => setField('Province', e.target.value)} error={errors['Province']} />
        <Input label="Numéro de Téléphone" value={formData['numéro de Téléphone']} onChange={(e) => setField('numéro de Téléphone', e.target.value)} error={errors['numéro de Téléphone']} />
        <Input type="number" label="Latitude" value={formData['Latitude']} onChange={(e) => setField('Latitude', e.target.value)} error={errors['Latitude']} />
        <Input type="number" label="Longitude" value={formData['Longitude']} onChange={(e) => setField('Longitude', e.target.value)} error={errors['Longitude']} />
        <Input type="date" label="Date Creation" value={formData['Date Creation']} onChange={(e) => setField('Date Creation', e.target.value)} error={errors['Date Creation']} />
        <Input label="Numéro de création" value={formData['numéro de création']} onChange={(e) => setField('numéro de création', e.target.value)} error={errors['numéro de création']} />
        <Input type="date" label="Date Mise en service" value={formData['Date Mise en service']} onChange={(e) => setField('Date Mise en service', e.target.value)} error={errors['Date Mise en service']} />
        <Input label="Numéro de Mise en service" value={formData['numéro de Mise en service']} onChange={(e) => setField('numéro de Mise en service', e.target.value)} error={errors['numéro de Mise en service']} />
        <Input type="number" label="Capacité Gasoil" value={formData['Capacité Gasoil']} onChange={(e) => setField('Capacité Gasoil', e.target.value)} error={errors['Capacité Gasoil']} />
        <Input type="number" label="Capacité SSP" value={formData['Capacité SSP']} onChange={(e) => setField('Capacité SSP', e.target.value)} error={errors['Capacité SSP']} />

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select className="mt-1 w-full rounded-md border p-2" value={formData['Type']} onChange={(e) => setField('Type', e.target.value as any)}>
            <option value="service">service</option>
            <option value="remplissage">remplissage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type Autorisation</label>
          <select className="mt-1 w-full rounded-md border p-2" value={formData['Type Autorisation']} onChange={(e) => setField('Type Autorisation', e.target.value as any)}>
            <option value="création">création</option>
            <option value="transformation">transformation</option>
            <option value="transfert">transfert</option>
            <option value="changement de marques">changement de marques</option>
          </select>
        </div>
      </div>

      {errors.submit && <ErrorMessage error={errors.submit} />}

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="primary" disabled={submitting}>
          {mode === 'create' ? 'Créer' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}