export interface GasStation {
  id: string;
  name: string;
  address: string;
  brand: string;
  city: string;
  fuelTypes: string[];
  hasShop: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  openHours: string;
  prices: Record<string, number>;
  services: string[];
  updatedAt: any;
}

export interface NewGasStation {
  name: string;
  address: string;
  brand: string;
  city: string;
  latitude: string;
  longitude: string;
  openHours: string;
  dieselPrice: string;
  gasoline95Price: string;
  fuelTypes: string[];
  services: string[];
  hasShop: boolean;
}