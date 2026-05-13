"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const CampusMapWrapper = dynamic(
  () => import("@/components/map/CampusMapWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[280px] bg-muted animate-pulse rounded-xl flex items-center justify-center">
        <MapPin className="h-6 w-6 text-muted-foreground animate-bounce" />
      </div>
    ),
  }
);

export default function ReportMapClient({ reports }: { reports: any[] }) {
  return (
    <div className="h-[280px] rounded-xl overflow-hidden border border-border/40">
      <CampusMapWrapper reports={reports} />
    </div>
  );
}
