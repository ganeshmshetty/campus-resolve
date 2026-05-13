import { createClient } from "@/utils/supabase/server";
import { DashboardNav } from "@/components/layout/nav";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CampusMapWrapper from "@/components/map/CampusMapWrapper";

export default async function MapPage() {
  const supabase = await createClient();

  // Fetch reports with valid coordinates for the map
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    console.error("Error fetching map reports:", error);
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/10">
      <DashboardNav />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black font-heading tracking-tight text-foreground uppercase">
              Campus <span className="text-primary">Watch</span>
            </h1>
            <p className="text-muted-foreground">
              Geographic distribution of active civic issues at RVCE.
            </p>
          </div>
          <Card className="bg-primary/5 border-primary/20 rounded-xl shadow-none hidden md:block">
            <CardContent className="p-3 flex items-center gap-3">
              <Info className="h-4 w-4 text-primary" />
              <p className="text-xs font-medium text-primary">
                Map constrained to RVCE Campus boundaries.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-3xl overflow-hidden border-4 border-background shadow-2xl bg-background h-[650px] relative">
          <CampusMapWrapper reports={reports || []} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border/40 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Open</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border/40 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">In Progress</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border/40 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"></div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Resolved</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border/40 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Acknowledged</span>
            </div>
        </div>
      </main>
    </div>
  );
}
