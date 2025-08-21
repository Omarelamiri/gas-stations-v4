import { NewGasStation, GasStation } from '@/types/station';

/**
 * Transform NewGasStation form data to Firestore document format
 */
export function transformNewStationToFirestore(
  stationData: NewGasStation,
  userId: string
) {
  const {
    name,
    address,
    brand,
    city,
    latitude,
    longitude,
    openHours,
    dieselPrice,
    gasoline95Price,
    fuelTypes,
    services,
    hasShop
  } = stationData;

  // Build prices object, only including valid prices
  const prices: Record<string, number> = {};
  
  if (dieselPrice && parseFloat(dieselPrice) > 0) {
    prices.diesel = parseFloat(dieselPrice);
  }
  
  if (gasoline95Price && parseFloat(gasoline95Price) > 0) {
    prices.gasoline95 = parseFloat(gasoline95Price);
  }

  return {
    name: name.trim(),
    address: address.trim(),
    brand: brand.trim() || 'Other',
    city: city.trim(),
    location: {
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0
    },
    openHours: openHours || '24/7',
    prices,
    fuelTypes: fuelTypes || [],
    services: services || [],
    hasShop: Boolean(hasShop),
    updatedAt: new Date(),
    createdAt: new Date(),
    userId
  };
}

/**
 * Transform partial station data for updates
 */
export function transformStationForUpdate(
  stationData: Partial<NewGasStation>
) {
  const updateData: any = {
    updatedAt: new Date()
  };

  // Only include fields that are provided
  if (stationData.name !== undefined) {
    updateData.name = stationData.name.trim();
  }

  if (stationData.address !== undefined) {
    updateData.address = stationData.address.trim();
  }

  if (stationData.brand !== undefined) {
    updateData.brand = stationData.brand.trim() || 'Other';
  }

  if (stationData.city !== undefined) {
    updateData.city = stationData.city.trim();
  }

  if (stationData.latitude !== undefined || stationData.longitude !== undefined) {
    updateData.location = {
      latitude: parseFloat(stationData.latitude || '0') || 0,
      longitude: parseFloat(stationData.longitude || '0') || 0
    };
  }

  if (stationData.openHours !== undefined) {
    updateData.openHours = stationData.openHours || '24/7';
  }

  // Handle prices
  if (stationData.dieselPrice !== undefined || stationData.gasoline95Price !== undefined) {
    updateData.prices = {};
    
    if (stationData.dieselPrice !== undefined && parseFloat(stationData.dieselPrice) > 0) {
      updateData.prices.diesel = parseFloat(stationData.dieselPrice);
    }
    
    if (stationData.gasoline95Price !== undefined && parseFloat(stationData.gasoline95Price) > 0) {
      updateData.prices.gasoline95 = parseFloat(stationData.gasoline95Price);
    }
  }

  if (stationData.fuelTypes !== undefined) {
    updateData.fuelTypes = stationData.fuelTypes || [];
  }

  if (stationData.services !== undefined) {
    updateData.services = stationData.services || [];
  }

  if (stationData.hasShop !== undefined) {
    updateData.hasShop = Boolean(stationData.hasShop);
  }

  return updateData;
}

/**
 * Transform GasStation to NewGasStation format (for editing)
 */
export function transformStationToForm(station: GasStation): NewGasStation {
  return {
    name: station.name,
    address: station.address,
    brand: station.brand,
    city: station.city,
    latitude: station.location.latitude.toString(),
    longitude: station.location.longitude.toString(),
    openHours: station.openHours,
    dieselPrice: station.prices?.diesel?.toString() || '',
    gasoline95Price: station.prices?.gasoline95?.toString() || '',
    fuelTypes: station.fuelTypes || [],
    services: station.services || [],
    hasShop: station.hasShop
  };
}