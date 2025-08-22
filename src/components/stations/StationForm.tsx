'use client';

import { useStationForm } from '@/hooks/useStationForm';
import { GasStation } from '@/types/station';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface StationFormProps {
  mode: 'create' | 'edit';
  station?: GasStation;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StationForm({ mode, station, onSuccess, onCancel }: StationFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    isValid,
    updateField,
    handleSubmit,
    resetForm
  } = useStationForm({
    mode,
    initialData: station,
    onSuccess,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Station Name"
            name="Nom de Station"
            value={formData['Nom de Station']}
            onChange={(e) => updateField('Nom de Station', e.target.value)}
            error={errors['Nom de Station']}
            required
            placeholder="Enter station name"
          />

          <Input
            label="Social Reason"
            name="Raison sociale"
            value={formData['Raison sociale']}
            onChange={(e) => updateField('Raison sociale', e.target.value)}
            error={errors['Raison sociale']}
            placeholder="Company social reason"
          />

          <Input
            label="Brand"
            name="Marque"
            value={formData['Marque']}
            onChange={(e) => updateField('Marque', e.target.value)}
            error={errors['Marque']}
            placeholder="e.g. Shell, Total, Afriquia"
          />

          <Input
            label="Owner"
            name="Propriétaire"
            value={formData['Propriétaire']}
            onChange={(e) => updateField('Propriétaire', e.target.value)}
            error={errors['Propriétaire']}
            placeholder="Owner name"
          />

          <Input
            label="Manager"
            name="Gérant"
            value={formData['Gérant']}
            onChange={(e) => updateField('Gérant', e.target.value)}
            error={errors['Gérant']}
            required
            placeholder="Manager name"
          />

          <Input
            label="Manager CIN"
            name="CIN Gérant"
            value={formData['CIN Gérant']}
            onChange={(e) => updateField('CIN Gérant', e.target.value)}
            error={errors['CIN Gérant']}
            placeholder="Manager ID number"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Address"
            name="Adesse"
            value={formData['Adesse']}
            onChange={(e) => updateField('Adesse', e.target.value)}
            error={errors['Adesse']}
            required
            placeholder="Full address"
            className="md:col-span-2"
          />

          <Input
            label="Commune"
            name="Commune"
            value={formData['Commune']}
            onChange={(e) => updateField('Commune', e.target.value)}
            error={errors['Commune']}
            placeholder="Commune name"
          />

          <Input
            label="Province"
            name="Province"
            value={formData['Province']}
            onChange={(e) => updateField('Province', e.target.value)}
            error={errors['Province']}
            required
            placeholder="Province name"
          />

          <Input
            label="Latitude"
            name="Latitude"
            type="number"
            step="any"
            value={formData['Latitude']}
            onChange={(e) => updateField('Latitude', e.target.value)}
            error={errors['Latitude']}
            placeholder="e.g. 34.020882"
          />

          <Input
            label="Longitude"
            name="Longitude"
            type="number"
            step="any"
            value={formData['Longitude']}
            onChange={(e) => updateField('Longitude', e.target.value)}
            error={errors['Longitude']}
            placeholder="e.g. -6.841650"
          />
        </div>
      </div>

      {/* Type and Authorization */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Type & Authorization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData['Type']}
              onChange={(e) => updateField('Type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="service">Service</option>
              <option value="remplissage">Remplissage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Authorization Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData['Type Autorisation']}
              onChange={(e) => updateField('Type Autorisation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="création">Création</option>
              <option value="transformation">Transformation</option>
              <option value="transfert">Transfert</option>
              <option value="changement de marques">Changement de marques</option>
            </select>
          </div>
        </div>
      </div>

      {/* Numbers and Dates */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Creation & Service Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Creation Number"
            name="numéro de création"
            value={formData['numéro de création']}
            onChange={(e) => updateField('numéro de création', e.target.value)}
            error={errors['numéro de création']}
            required
            placeholder="Creation number"
          />

          <Input
            label="Service Number"
            name="numéro de Mise en service"
            value={formData['numéro de Mise en service']}
            onChange={(e) => updateField('numéro de Mise en service', e.target.value)}
            error={errors['numéro de Mise en service']}
            required
            placeholder="Service number"
          />

          <Input
            label="Creation Date"
            name="Date Creation"
            type="date"
            value={formData['Date Creation']}
            onChange={(e) => updateField('Date Creation', e.target.value)}
            error={errors['Date Creation']}
            required
          />

          <Input
            label="Service Date"
            name="Date Mise en service"
            type="date"
            value={formData['Date Mise en service']}
            onChange={(e) => updateField('Date Mise en service', e.target.value)}
            error={errors['Date Mise en service']}
            required
          />
        </div>
      </div>

      {/* Capacities */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Capacities (Liters)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Gasoil Capacity"
            name="Capacité Gasoil"
            type="number"
            min="0"
            value={formData['Capacité Gasoil']}
            onChange={(e) => updateField('Capacité Gasoil', e.target.value)}
            error={errors['Capacité Gasoil']}
            required
            placeholder="e.g. 50000"
          />

          <Input
            label="SSP Capacity"
            name="Capacité SSP"
            type="number"
            min="0"
            value={formData['Capacité SSP']}
            onChange={(e) => updateField('Capacité SSP', e.target.value)}
            error={errors['Capacité SSP']}
            required
            placeholder="e.g. 30000"
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <Input
          label="Phone Number"
          name="numéro de Téléphone"
          value={formData['numéro de Téléphone']}
          onChange={(e) => updateField('numéro de Téléphone', e.target.value)}
          error={errors['numéro de Téléphone']}
          placeholder="Phone number"
        />
      </div>

      {/* Form Errors */}
      {errors.submit && (
        <ErrorMessage error={errors.submit} />
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting 
            ? (mode === 'create' ? 'Creating...' : 'Updating...') 
            : (mode === 'create' ? 'Create Station' : 'Update Station')
          }
        </Button>
      </div>
    </form>
  );
}