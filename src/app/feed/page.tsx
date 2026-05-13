import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardNav } from "@/components/layout/nav";
import { MapWidget } from "@/components/map/MapWidget";
import { ReportEngagement } from "@/components/ReportEngagement";

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

  // Get current user (may be null for public visitors)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all reports with author profiles
  const { data: reports, error } = await supabase
    .from("reports")
    .select("*, profiles!reports_created_by_fkey(name), report_images(image_url)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching feed:", error);
  }

  // Fetch vote counts for all reports
  const { data: voteCounts } = await supabase
    .from("report_votes")
    .select("report_id");

  // Fetch user's own votes (if logged in)
  const { data: userVotes } = user
    ? await supabase
        .from("report_votes")
        .select("report_id")
        .eq("user_id", user.id)
    : { data: [] };

  // Fetch comments for all reports (with author names)
  const { data: allComments } = await supabase
    .from("report_comments")
    .select("id, report_id, content, created_at, profiles(name)")
    .order("created_at", { ascending: true });

  // Build lookup maps
  const voteCountMap: Record<string, number> = {};
  const userVotedSet = new Set((userVotes ?? []).map((v) => v.report_id));
  for (const v of voteCounts ?? []) {
    voteCountMap[v.report_id] = (voteCountMap[v.report_id] ?? 0) + 1;
  }

  const commentsByReport: Record<string, typeof allComments> = {};
  for (const c of allComments ?? []) {
    if (!commentsByReport[c.report_id]) commentsByReport[c.report_id] = [];
    commentsByReport[c.report_id]!.push(c);
  }

  const mappedReports = reports?.filter((r) => r.latitude && r.longitude) || [];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/10">
      <DashboardNav />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-black font-heading tracking-tighter text-foreground">
              Campus <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Pulse</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              See what&apos;s happening around RVCE. Transparency leads to action.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-6">
              {!reports || reports.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground">
                    The campus is quiet today. No issues reported yet.
                  </p>
                </div>
              ) : (
                reports.map((report) => {
                  const reportComments = (commentsByReport[report.id] ?? []) as unknown as {
                    id: string;
                    content: string;
                    created_at: string;
                    profiles: { name: string } | null;
                  }[];

                  return (
                    <Card
                      key={report.id}
                      className="group overflow-hidden border-border/40 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all duration-300 rounded-2xl bg-background"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                              <StatusBadge status={report.status} />
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-muted-foreground/40 before:rounded-full">
                                {report.category}
                              </span>
                            </div>
                            <CardTitle className="text-xl font-bold tracking-tight">
                              {report.title}
                            </CardTitle>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium shrink-0">
                            {formatDistanceToNow(new Date(report.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-4">
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 min-w-0 flex flex-col gap-3">
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {report.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-foreground/70">
                              <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="line-clamp-1">{report.address}</span>
                              </div>
                              {report.profiles?.name && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-border"></span>
                                  Reported by{" "}
                                  <span className="text-foreground font-semibold">
                                    {report.profiles.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {report.report_images?.[0]?.image_url && (
                            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-border/50 bg-muted/30">
                              <img src={report.report_images[0].image_url} alt="Report issue" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4 border-t border-border/40 flex flex-col gap-3 bg-muted/5 items-stretch">
                        <div className="flex justify-between items-center">
                          <ReportEngagement
                            reportId={report.id}
                            initialVoteCount={voteCountMap[report.id] ?? 0}
                            initialHasVoted={userVotedSet.has(report.id)}
                            comments={reportComments}
                          />
                          <Link href={`/reports/${report.id}`}>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="font-semibold group"
                            >
                              Details
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })
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
                <CardTitle className="text-lg font-bold">
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-4">
                <p>
                  Stay respectful and focus on constructive reporting to help
                  improve our campus life.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>No duplicate reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Accurate locations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
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
