import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { GasStation } from '@/types/station';

interface MapPreviewProps { stations: GasStation[]; }

const mapContainerStyle = { width: '100%', height: '480px', borderRadius: '16px' };

export default function MapPreview({ stations }: MapPreviewProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [selected, setSelected] = useState<GasStation | null>(null);

  const center = useMemo(() => {
    // fallback to Casablanca if no coords
    return { lat: 33.5731, lng: -7.5898 };
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

  useEffect(() => {
    if (!mapRef.current || stations.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    let has = false;
    stations.forEach((s) => {
      if (s.Latitude != null && s.Longitude != null) {
        bounds.extend({ lat: s.Latitude, lng: s.Longitude });
        has = true;
      }
    });
    if (has) mapRef.current.fitBounds(bounds);
  }, [stations]);

  if (!isLoaded) return null;

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10} onLoad={onLoad}>
      {stations.map((s) =>
        s.Latitude != null && s.Longitude != null ? (
          <Marker
            key={s.id}
            position={{ lat: s.Latitude, lng: s.Longitude }}
            onClick={() => setSelected(s)}
          />
        ) : null
      )}

      {selected && selected.Latitude != null && selected.Longitude != null && (
        <InfoWindow
          position={{ lat: selected.Latitude, lng: selected.Longitude }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-sm">
            <div className="font-semibold">{selected['Nom de Station']}</div>
            <div>{selected['Marque']}</div>
            <div className="mt-1">{selected['Adesse']}</div>
            <div className="mt-1">Gérant: {selected['Gérant']}</div>
            <div>Tél: {selected['numéro de Téléphone']}</div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}