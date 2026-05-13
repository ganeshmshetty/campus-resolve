"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Maximize2, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const CampusMap = dynamic(() => import("./CampusMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-muted animate-pulse flex items-center justify-center rounded-lg">
      <MapPin className="h-6 w-6 text-muted-foreground animate-bounce" />
    </div>
  ),
});

interface MapWidgetProps {
  reports: any[];
  title?: string;
  description?: string;
}

export function MapWidget({ reports, title = "Campus Watch", description = "Live issue distribution" }: MapWidgetProps) {
  const router = useRouter();

  return (
    <Card 
      className="overflow-hidden hover:border-primary/50 transition-all shadow-sm cursor-pointer group flex flex-col"
      onClick={() => router.push("/map")}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {title}
            </CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
          <Maximize2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:scale-110" />
        </div>
      </CardHeader>
      <CardContent className="p-0 relative h-[150px]">
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-background/20 to-transparent" />
        <CampusMap reports={reports} interactive={false} />
        <div className="absolute bottom-3 right-3 z-20">
            <span className="flex items-center gap-1.5 bg-background/80 hover:bg-background/95 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-border/50 text-foreground transition-all">
                View Full Map <ArrowRight className="h-3 w-3" />
            </span>
        </div>
      </CardContent>
    </Card>
  );
}
