'use client';

import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useState, useEffect, useRef, useCallback } from 'react';
import { GasStation } from '@/types/station';

interface MapPreviewProps {
  stations: GasStation[];
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Morocco)
const defaultCenter = {
  lat: 33.9716,
  lng: -6.8498
};

export function MapPreview({ stations }: MapPreviewProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(8);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Update map bounds when stations change
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

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
  }, []);

  const handleMarkerClick = useCallback((station: GasStation) => {
    setSelectedStation(station);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedStation(null);
  }, []);

  if (loadError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading map</p>
          <p className="text-sm text-gray-500">
            Please check your Google Maps API key
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">No stations to display on map</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={mapZoom}
      onLoad={onMapLoad}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
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
  );
}