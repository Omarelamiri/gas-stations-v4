// File: src/components/dashboard/MapPreview.tsx
// All coordinate references and InfoWindow content are updated
// to use the new field names.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GasStation } from '@/types/station';
import  Card  from '@/components/ui/Card';

interface MapPreviewProps {
  stations: GasStation[];
}

// Map styles to create a clean, modern look
const mapContainerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '0.5rem',
};

const defaultCenter = {
  lat: 31.7917,
  lng: -7.0926,
};

const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];

export function MapPreview({ stations }: MapPreviewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = useCallback((station: GasStation) => {
    setSelectedStation(station);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedStation(null);
  }, []);

  // Update bounds calculation
  useEffect(() => {
    if (mapRef.current && stations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoordinates = false;

      stations.forEach(station => {
        if (station['Latitude'] && station['Longitude']) {
          bounds.extend({
            lat: station['Latitude'],
            lng: station['Longitude'],
          });
          hasValidCoordinates = true;
        }
      });

      if (hasValidCoordinates) {
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [stations]);

  if (loadError) {
    return <Card className="p-6 text-center text-red-500">Error loading maps</Card>;
  }

  if (!isLoaded) {
    return <Card className="p-6 text-center text-gray-500">Loading Map...</Card>;
  }

  return (
    <Card className="p-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={6}
        onLoad={handleMapLoad}
      >
        {/* Update marker positions */}
        {stations.map(station => {
          // Skip stations without valid coordinates
          if (!station['Latitude'] || !station['Longitude']) {
            return null;
          }

          return (
            <Marker
              key={station.id}
              position={{
                lat: station['Latitude'],
                lng: station['Longitude'],
              }}
              onClick={() => handleMarkerClick(station)}
              title={station['Nom de Station']}
            />
          );
        })}

        {/* Update InfoWindow content */}
        {selectedStation && selectedStation['Latitude'] && selectedStation['Longitude'] && (
          <InfoWindow
            position={{
              lat: selectedStation['Latitude'],
              lng: selectedStation['Longitude'],
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-bold text-gray-900 mb-1">
                {selectedStation['Nom de Station']}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedStation['Adesse']}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {selectedStation['Province']} • {selectedStation['Marque']}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Manager: {selectedStation['Gérant']}
              </p>
              <div className="text-xs text-gray-500">
                <p>Type: {selectedStation['Type']}</p>
                <p>Phone: {selectedStation['numéro de Téléphone']}</p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Card>
  );
}