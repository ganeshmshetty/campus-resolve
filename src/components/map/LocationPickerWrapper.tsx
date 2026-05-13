"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center border border-border">
      <div className="flex flex-col items-center gap-2">
        <MapPin className="h-6 w-6 text-muted-foreground animate-bounce" />
        <p className="text-sm text-muted-foreground font-medium">Loading Map...</p>
      </div>
    </div>
  ),
});

export default function LocationPickerWrapper({ 
  onLocationSelect 
}: { 
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  return <LocationPicker onLocationSelect={onLocationSelect} />;
}
