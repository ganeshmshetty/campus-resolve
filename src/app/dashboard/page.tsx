import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, FileWarning, PlusCircle, Users, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch role from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user?.id)
    .single();

  const role = profile?.role || "user";

  // Data fetching based on role
  let reports = [];
  let stats = null;

  if (role === "admin") {
    const { data: allReports } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    reports = allReports || [];
    // Basic stats for admin
    stats = {
      total: reports.length,
      open: reports.filter(r => r.status === "OPEN").length,
      resolved: reports.filter(r => r.status === "RESOLVED").length,
    };
  } else if (role === "authority") {
    const { data: assignedReports } = await supabase.from("reports").select("*").eq("assigned_to", user?.id).order("created_at", { ascending: false });
    reports = assignedReports || [];
  } else {
    const { data: userReports } = await supabase.from("reports").select("*").eq("created_by", user?.id).order("created_at", { ascending: false });
    reports = userReports || [];
  }

  // Reports with coords for the map widget
  const mappedReports = reports.filter(r => r.latitude && r.longitude);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">
            {role === "admin" ? "Admin Command Center" : role === "authority" ? "Authority Workspace" : "My Reports"}
          </h1>
          <p className="text-muted-foreground">
            {role === "admin" 
              ? "Oversee all campus issues and management." 
              : role === "authority" 
              ? "Manage and resolve assigned campus issues." 
              : "Track the status of the civic issues you've reported."}
          </p>
        </div>
        <div className="flex gap-2">
            <Link href="/feed">
              <Button variant="outline" className="font-medium">
                <Activity className="mr-2 h-4 w-4" />
                Public Feed
              </Button>
            </Link>
            {role === "user" && (
                <Link href="/reports/new">
                <Button className="font-medium bg-primary hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Report Issue
                </Button>
                </Link>
            )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {role === "admin" && stats && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="bg-primary/5 border-primary/10">
                  <CardHeader className="pb-2 p-4">
                    <CardDescription className="text-primary font-medium text-xs">Total Reports</CardDescription>
                    <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
                  </CardHeader>
              </Card>
              <Card className="bg-orange-500/5 border-orange-500/10">
                  <CardHeader className="pb-2 p-4">
                    <CardDescription className="text-orange-600 font-medium text-xs">Pending Action</CardDescription>
                    <CardTitle className="text-2xl font-bold">{stats.open}</CardTitle>
                  </CardHeader>
              </Card>
              <Card className="bg-green-500/5 border-green-500/10">
                  <CardHeader className="pb-2 p-4">
                    <CardDescription className="text-green-600 font-medium text-xs">Resolved</CardDescription>
                    <CardTitle className="text-2xl font-bold">{stats.resolved}</CardTitle>
                  </CardHeader>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            {reports.length === 0 ? (
              <Card className="border-dashed border-2 shadow-none bg-background/50">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="bg-muted p-4 rounded-full mb-4">
                    <FileWarning className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold font-heading tracking-tight mb-2">
                    No reports found
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    {role === "admin" 
                      ? "There are currently no reports in the system." 
                      : role === "authority" 
                      ? "You don't have any reports assigned to you yet." 
                      : "You haven't reported any issues on campus yet."}
                  </p>
                  {role === "user" && (
                    <Link href="/reports/new">
                      <Button size="sm">Start Reporting</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {reports.slice(0, 6).map((report) => (
                  <Link key={report.id} href={`/reports/${report.id}`}>
                    <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md shadow-sm cursor-pointer group">
                      <CardHeader className="pb-2 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <StatusBadge status={report.status} />
                          <span className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <CardTitle className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">
                          {report.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                          {report.description}
                        </p>
                        <div className="flex items-center text-[10px] text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1 shrink-0" />
                          <span className="line-clamp-1">{report.address}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            {reports.length > 6 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground font-semibold">
                  View All Reports
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
           <MapWidget 
             reports={mappedReports} 
             description={`${mappedReports.length} issues pinned on campus`}
           />
           
           <Card className="border-primary/20 bg-primary/5 shadow-none rounded-2xl">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-primary" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs space-y-3 text-muted-foreground leading-relaxed">
                <p>• Be specific with the address to help authorities find the issue.</p>
                <p>• Upload a clear photo of the problem for faster resolution.</p>
                <p>• Check the <strong>Public Feed</strong> to see if the issue is already reported.</p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
