"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const CampusMap = dynamic(() => import("./CampusMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted animate-pulse rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <MapPin className="h-8 w-8 text-muted-foreground animate-bounce" />
        <p className="text-muted-foreground font-medium">Loading RVCE Map...</p>
      </div>
    </div>
  ),
});

export default function CampusMapWrapper({ reports }: { reports: any[] }) {
  return <CampusMap reports={reports} />;
}
