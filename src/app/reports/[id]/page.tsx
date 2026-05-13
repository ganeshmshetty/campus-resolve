import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReportEngagement } from "@/components/ReportEngagement";
import ReportMapClient from "@/components/map/ReportMapClient";

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the report
  const { data: report, error } = await supabase
    .from("reports")
    .select("*, profiles!reports_created_by_fkey(name), report_images(image_url)")
    .eq("id", resolvedParams.id)
    .single();

  if (error || !report) {
    notFound();
  }

  // Fetch vote count
  const { count: voteCount } = await supabase
    .from("report_votes")
    .select("*", { count: "exact", head: true })
    .eq("report_id", resolvedParams.id);

  // Check if current user has voted
  const { data: userVote } = user
    ? await supabase
        .from("report_votes")
        .select("id")
        .eq("report_id", resolvedParams.id)
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  // Fetch comments with author names
  const { data: comments } = await supabase
    .from("report_comments")
    .select("id, content, created_at, profiles(name)")
    .eq("report_id", resolvedParams.id)
    .order("created_at", { ascending: true });

  const typedComments = (comments ?? []) as unknown as {
    id: string;
    content: string;
    created_at: string;
    profiles: { name: string } | null;
  }[];

  // Only show map marker if the report has coordinates
  const mapReports =
    report.latitude && report.longitude ? [report] : [];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading tracking-tight">
              {report.title}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
              <span className="capitalize">{report.category}</span>
              <span>•</span>
              <span>
                Reported{" "}
                {formatDistanceToNow(new Date(report.created_at), {
                  addSuffix: true,
                })}
              </span>
              {report.profiles?.name && (
                <>
                  <span>•</span>
                  <span>
                    by{" "}
                    <span className="font-semibold text-foreground">
                      {report.profiles.name}
                    </span>
                  </span>
                </>
              )}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium border bg-muted">
            {report.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          {report.report_images && report.report_images.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {report.report_images.map((img: any, idx: number) => (
                <div key={idx} className="w-full h-64 overflow-hidden rounded-xl border border-border/50">
                  <img src={img.image_url} alt="Report issue" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          )}
          <p className="whitespace-pre-wrap leading-relaxed">{report.description}</p>
        </CardContent>
      </Card>

      {/* Map section — real map if coordinates exist */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.address && (
            <p className="text-sm text-muted-foreground">{report.address}</p>
          )}
          {mapReports.length > 0 ? (
            <ReportMapClient reports={mapReports} />
          ) : (
            <div className="mt-2 rounded-lg border border-dashed border-border/60 bg-muted/30 p-8 text-center text-muted-foreground text-sm">
              No precise coordinates recorded for this report.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement — votes & comments */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Community Response</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportEngagement
            reportId={report.id}
            initialVoteCount={voteCount ?? 0}
            initialHasVoted={!!userVote}
            comments={typedComments}
            showComments={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
