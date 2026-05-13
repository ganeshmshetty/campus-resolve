import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, FileWarning, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's reports
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .eq("created_by", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading tracking-tight">
            My Reports
          </h1>
          <p className="text-muted-foreground">
            Track the status of the civic issues you've reported.
          </p>
        </div>
        <Link href="/reports/new">
          <Button className="font-medium bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </Link>
      </div>

      {!reports || reports.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none bg-background/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-muted p-4 rounded-full mb-4">
              <FileWarning className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold font-heading tracking-tight mb-2">
              No reports yet
            </h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't reported any issues on campus yet. Help us keep the
              environment safe and clean!
            </p>
            <Link href="/reports/new">
              <Button>Start Reporting</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="h-full hover:border-primary/50 transition-colors shadow-sm cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <StatusBadge status={report.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(report.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="capitalize">
                    {report.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {report.description}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 shrink-0" />
                    <span className="line-clamp-1">{report.address}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
