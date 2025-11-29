import { Paperclip, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessageThreadSummary } from "@/types";

interface ThreadListProps {
  threads: MessageThreadSummary[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const formatTimeAgo = (isoDate: string) => {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function ThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
  searchQuery,
  onSearchChange,
}: ThreadListProps) {
  const unreadCount = threads.filter((t) => !t.isRead).length;

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filters */}
      <div className="p-4 space-y-3 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--medium-grey))]" />
          <Input
            placeholder="Search messages..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-xs">
          <Button variant="ghost" size="sm" className="h-7">
            <Filter className="h-3 w-3 mr-1" />
            All Messages
          </Button>
          <Button variant="ghost" size="sm" className="h-7">
            Unread
          </Button>
          <Button variant="ghost" size="sm" className="h-7">
            Sent
          </Button>
        </div>
      </div>

      {/* Thread List */}
      <ScrollArea className="flex-1">
        <div>
          {threads.map((thread) => {
            const senderName = thread.participants.find((p) => p.isClient)?.name || "Unknown";
            const hasAttachment = false; // Would come from thread data

            return (
              <div
                key={thread.id}
                onClick={() => onSelectThread(thread.id)}
                className={`p-4 border-b border-border/30 cursor-pointer transition-colors hover:bg-muted/30 ${
                  selectedThreadId === thread.id
                    ? "bg-[hsl(var(--gradient-blue))]/10 border-l-4 border-l-[hsl(var(--gradient-blue))]"
                    : !thread.isRead
                    ? "bg-blue-50/50"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!thread.isRead && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <p className={`text-sm truncate ${!thread.isRead ? "font-semibold" : "font-medium"}`}>
                        {senderName}
                      </p>
                    </div>
                    <p className={`text-sm mt-1 truncate ${!thread.isRead ? "font-medium" : ""}`}>
                      {thread.subject}
                    </p>
                    <p className="text-xs text-[hsl(var(--medium-grey))] mt-1 truncate">
                      {thread.lastMessagePreview}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-[hsl(var(--medium-grey))]">
                      {formatTimeAgo(thread.lastMessageAt)}
                    </span>
                    {hasAttachment && <Paperclip className="h-3 w-3 text-[hsl(var(--medium-grey))]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Quick Stats */}
      <div className="p-4 border-t border-border/50">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--medium-grey))]">Total threads:</span>
                <span className="font-medium">{threads.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--medium-grey))]">Unread:</span>
                <span className="font-medium">{unreadCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
