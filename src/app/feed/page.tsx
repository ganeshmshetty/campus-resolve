import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, ArrowRight, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/layout/nav";
import { MapWidget } from "@/components/map/MapWidget";

function StatusBadge({ status }: { status: string }) {
  const statusStyles: Record<string, string> = {
    OPEN: "bg-destructive/10 text-destructive border-destructive/20",
    ACKNOWLEDGED: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    IN_PROGRESS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    RESOLVED: "bg-primary/10 text-primary border-primary/20",
    CLOSED: "bg-muted text-muted-foreground border-border",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  const style = statusStyles[status] || statusStyles.OPEN;

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${style}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function FeedPage() {
  const supabase = await createClient();

  // Fetch all reports for the public feed
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*, profiles!reports_created_by_fkey(name)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feed:", error);
  }

  const mappedReports = reports?.filter(r => r.latitude && r.longitude) || [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/10">
      <DashboardNav />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
            <h1 className="text-4xl font-black font-heading tracking-tighter text-foreground">
                Campus <span className="text-primary">Pulse</span>
            </h1>
            <p className="text-muted-foreground text-lg">
                See what's happening around RVCE. Transparency leads to action.
            </p>
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid gap-6">
                {!reports || reports.length === 0 ? (
                    <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border">
                        <p className="text-muted-foreground">The campus is quiet today. No issues reported yet.</p>
                    </div>
                ) : (
                    reports.map((report) => (
                    <Card key={report.id} className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-all rounded-2xl bg-background">
                        <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                                <StatusBadge status={report.status} />
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                {report.category}
                                </span>
                            </div>
                            <CardTitle className="text-2xl font-bold tracking-tight">
                                {report.title}
                            </CardTitle>
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                            </span>
                        </div>
                        </CardHeader>
                        <CardContent className="pb-4">
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm font-medium text-foreground/70">
                            <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="line-clamp-1">{report.address}</span>
                            </div>
                            {report.profiles?.name && (
                                <div className="text-xs text-muted-foreground">
                                    Reported by <span className="text-foreground font-semibold">{report.profiles.name}</span>
                                </div>
                            )}
                        </div>
                        </CardContent>
                        <CardFooter className="pt-4 border-t border-border/40 flex justify-between bg-muted/5">
                        <div className="flex gap-4">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                    <ThumbsUp className="h-4 w-4 mr-2" />
                                    Helpful
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Comment
                                </Button>
                        </div>
                        <Link href={`/reports/${report.id}`}>
                                <Button size="sm" variant="secondary" className="font-semibold group">
                                    Details
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                        </Link>
                        </CardFooter>
                    </Card>
                    ))
                )}
                </div>
            </div>

            <div className="space-y-6">
                <MapWidget 
                    reports={mappedReports} 
                    title="Geographic Pulse"
                    description="Issues across RVCE grounds"
                />
                
                <Card className="rounded-2xl border-border/40 shadow-sm bg-background">
                    <CardHeader className="p-4">
                        <CardTitle className="text-lg font-bold">Community Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-4">
                        <p>Stay respectful and focus on constructive reporting to help improve our campus life.</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span>No duplicate reports</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span>Accurate locations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span>Clear descriptions</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
