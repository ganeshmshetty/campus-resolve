"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";

const RVCE_CENTER = { latitude: 12.9226, longitude: 77.4987 };
const RVCE_BOUNDS: [number, number, number, number] = [
  77.492, 12.918,
  77.505, 12.927,
];

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLocation?: { latitude: number; longitude: number };
}

export default function LocationPicker({ onLocationSelect, defaultLocation }: LocationPickerProps) {
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(
    defaultLocation || null
  );

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.lngLat;
    setMarker({ latitude: lat, longitude: lng });
    onLocationSelect(lat, lng);
  };

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border border-border">
      <Map
        initialViewState={{
          ...RVCE_CENTER,
          zoom: 16,
        }}
        maxBounds={RVCE_BOUNDS}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        onClick={handleMapClick}
        cursor="crosshair"
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-left"
          trackUserLocation={false}
          showAccuracyCircle={false}
          onGeolocate={(e) => {
            const lat = e.coords.latitude;
            const lng = e.coords.longitude;
            setMarker({ latitude: lat, longitude: lng });
            onLocationSelect(lat, lng);
          }}
        />
        
        {marker && (
          <Marker
            latitude={marker.latitude}
            longitude={marker.longitude}
            anchor="bottom"
          >
            <MapPin className="h-8 w-8 text-primary drop-shadow-md animate-in fade-in slide-in-from-top-4" />
          </Marker>
        )}
        
        {!marker && (
          <div className="absolute inset-x-0 top-4 flex justify-center pointer-events-none z-10">
            <span className="bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border border-border/50 text-foreground pointer-events-auto">
              Click anywhere on the map to drop a pin
            </span>
          </div>
        )}
      </Map>
    </div>
  );
}
