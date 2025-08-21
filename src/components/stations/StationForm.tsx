'use client';

import { useStationForm } from '@/hooks/useStationForm';
import { GasStation } from '@/types/station';
import  Button  from '@/components/ui/Button';
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
            name="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={errors.name}
            required
            placeholder="Enter station name"
          />

          <Input
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={(e) => updateField('brand', e.target.value)}
            error={errors.brand}
            placeholder="e.g. Shell, Total, Afriquia"
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            error={errors.address}
            required
            placeholder="Full address"
            className="md:col-span-2"
          />

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
            error={errors.city}
            required
            placeholder="City name"
          />

          <Input
            label="Open Hours"
            name="openHours"
            value={formData.openHours}
            onChange={(e) => updateField('openHours', e.target.value)}
            error={errors.openHours}
            placeholder="e.g. 24/7 or 06:00-22:00"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            name="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => updateField('latitude', e.target.value)}
            error={errors.latitude}
            placeholder="e.g. 34.020882"
          />

          <Input
            label="Longitude"
            name="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => updateField('longitude', e.target.value)}
            error={errors.longitude}
            placeholder="e.g. -6.841650"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter coordinates for map display. Leave empty if unknown.
        </p>
      </div>

      {/* Fuel Prices */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fuel Prices (MAD)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Diesel Price"
            name="dieselPrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.dieselPrice}
            onChange={(e) => updateField('dieselPrice', e.target.value)}
            error={errors.dieselPrice}
            placeholder="e.g. 12.50"
          />

          <Input
            label="Gasoline 95 Price"
            name="gasoline95Price"
            type="number"
            step="0.01"
            min="0"
            value={formData.gasoline95Price}
            onChange={(e) => updateField('gasoline95Price', e.target.value)}
            error={errors.gasoline95Price}
            placeholder="e.g. 13.20"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter current fuel prices per liter. Leave empty if not available.
        </p>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hasShop"
            checked={formData.hasShop}
            onChange={(e) => updateField('hasShop', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="hasShop" className="ml-2 text-sm text-gray-900">
            Has convenience store/shop
          </label>
        </div>
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