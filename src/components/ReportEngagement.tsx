"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleVoteAction, addCommentAction } from "@/app/feed/actions";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { name: string } | null;
}

interface ReportEngagementProps {
  reportId: string;
  initialVoteCount: number;
  initialHasVoted: boolean;
  comments: Comment[];
  showComments?: boolean;
}

export function ReportEngagement({
  reportId,
  initialVoteCount,
  initialHasVoted,
  comments: initialComments,
  showComments = false,
}: ReportEngagementProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [showCommentBox, setShowCommentBox] = useState(showComments);
  const [isPendingVote, startVoteTransition] = useTransition();
  const [isPendingComment, startCommentTransition] = useTransition();

  const handleVote = () => {
    startVoteTransition(async () => {
      const result = await toggleVoteAction(reportId);
      if (!result?.error) {
        setHasVoted((prev) => !prev);
        setVoteCount((prev) => (hasVoted ? prev - 1 : prev + 1));
      }
    });
  };

  const handleComment = () => {
    setCommentError(null);
    startCommentTransition(async () => {
      const result = await addCommentAction(reportId, commentText);
      if (result?.error) {
        setCommentError(result.error);
      } else {
        // Optimistically add comment to UI (without profile name)
        const optimistic: Comment = {
          id: crypto.randomUUID(),
          content: commentText.trim(),
          created_at: new Date().toISOString(),
          profiles: null,
        };
        setComments((prev) => [...prev, optimistic]);
        setCommentText("");
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Action bar */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVote}
          disabled={isPendingVote}
          className={`gap-2 transition-colors ${
            hasVoted
              ? "text-primary bg-primary/10 hover:bg-primary/15"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {isPendingVote ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? "fill-primary" : ""}`} />
          )}
          <span className="font-semibold">{voteCount}</span>
          Helpful
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCommentBox((prev) => !prev)}
          className="text-muted-foreground hover:text-primary gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-semibold">{comments.length}</span>
          {showCommentBox ? "Hide" : "Comments"}
        </Button>
      </div>

      {/* Comments section */}
      {showCommentBox && (
        <div className="space-y-3 pt-1">
          {comments.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border border-border/40 divide-y divide-border/30 bg-muted/30">
              {comments.map((c) => (
                <div key={c.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">
                      {c.profiles?.name ?? "You"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(c.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleComment();
                }
              }}
              placeholder="Add a comment…"
              className="flex-1 text-sm bg-background border border-border/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground/60"
            />
            <Button
              size="sm"
              onClick={handleComment}
              disabled={isPendingComment || !commentText.trim()}
              className="shrink-0"
            >
              {isPendingComment ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          {commentError && (
            <p className="text-xs text-destructive">{commentError}</p>
          )}
        </div>
      )}
    </div>
  );
}
