"use client";

import { useEffect, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/navigation";

// RVCE Campus Boundaries (Approximate)
const RVCE_CENTER = { latitude: 12.9226, longitude: 77.4987 };
const RVCE_BOUNDS: [number, number, number, number] = [
  77.492, 12.918, // Southwest coordinates
  77.505, 12.927, // Northeast coordinates
];

interface CampusMapProps {
  reports: any[];
  interactive?: boolean;
}

export default function CampusMap({ reports, interactive = true }: CampusMapProps) {
  const router = useRouter();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "#ef4444"; // destructive
      case "ACKNOWLEDGED": return "#f97316"; // orange
      case "IN_PROGRESS": return "#3b82f6"; // blue
      case "RESOLVED": return "#10b981"; // primary/green
      default: return "#6b7280";
    }
  };

  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          ...RVCE_CENTER,
          zoom: 16,
        }}
        maxBounds={RVCE_BOUNDS}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        dragPan={interactive}
        scrollZoom={interactive}
        boxZoom={interactive}
        doubleClickZoom={interactive}
        touchZoomRotate={interactive}
      >
        {interactive && <NavigationControl position="top-right" />}
        
        {reports.map((report) => (
          <Marker
            key={report.id}
            latitude={report.latitude}
            longitude={report.longitude}
            anchor="bottom"
            onClick={(e) => {
              if (interactive) {
                e.originalEvent.stopPropagation();
                router.push(`/reports/${report.id}`);
              }
            }}
          >
            <div 
              className="cursor-pointer transition-transform hover:scale-125"
              style={{ filter: `drop-shadow(0 0 4px ${getStatusColor(report.status)}66)` }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={getStatusColor(report.status)} 
                stroke="white" 
                strokeWidth="2"
              >
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
              </svg>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
