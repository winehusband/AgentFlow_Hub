import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, MoreVertical, Mail, Clock, Users, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useHubId } from "@/contexts/hub-context";
import { usePortalMembers, useInviteColleague, useTrackEngagement, useCurrentUser } from "@/hooks";
import type { Member, AccessLevel } from "@/types";

export function ClientPeopleSection() {
  const hubId = useHubId();
  const { toast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("full_access");

  // Data hooks
  const { data: membersData, isLoading } = usePortalMembers(hubId);
  const { data: authData } = useCurrentUser();
  const { mutate: inviteColleague, isPending: isInviting } = useInviteColleague(hubId);

  // Engagement tracking
  const { trackHubViewed } = useTrackEngagement(hubId);

  useEffect(() => {
    trackHubViewed("portal-people");
  }, [trackHubViewed]);

  const members = membersData?.items || [];
  const currentUserEmail = authData?.user?.email;
  const userDomain = currentUserEmail?.split("@")[1] || "";

  const getAccessBadgeColor = (access: AccessLevel) => {
    switch (access) {
      case "full_access":
        return "bg-[hsl(var(--gradient-blue))] text-white";
      case "proposal_only":
        return "bg-[hsl(var(--sage-green))] text-white";
      case "documents_only":
        return "bg-[hsl(var(--rich-violet))] text-white";
      case "view_only":
        return "bg-amber-500 text-white";
      default:
        return "bg-[hsl(var(--gradient-blue))] text-white";
    }
  };

  const formatAccessLevel = (access: AccessLevel) => {
    return access.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Email required", description: "Please enter an email address", variant: "destructive" });
      return;
    }
    if (!inviteEmail.endsWith(`@${userDomain}`)) {
      toast({
        title: "Invalid email",
        description: `You can only invite colleagues at @${userDomain}`,
        variant: "destructive",
      });
      return;
    }
    inviteColleague(
      { email: inviteEmail, accessLevel, message: inviteMessage || undefined },
      {
        onSuccess: () => {
          setInviteOpen(false);
          setInviteEmail("");
          setInviteMessage("");
          toast({ title: "Invitation sent", description: `Invitation sent to ${inviteEmail}` });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--gradient-blue))]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))] mb-2">People</h1>
          <p className="text-[hsl(var(--medium-grey))]">Colleagues with access to this hub</p>
        </div>
        <Button className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white" onClick={() => setInviteOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Someone
        </Button>
      </div>

      {/* Organization Section */}
      <div className="mb-8">
        {userDomain && (
          <p className="text-sm text-[hsl(var(--medium-grey))] mb-6">People at @{userDomain} can be invited to view content</p>
        )}

        {/* People List */}
        {members.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No other members yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {members.map((member) => {
              const isCurrentUser = member.email === currentUserEmail;
              return (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-[hsl(var(--gradient-blue))] text-white">
                        {member.displayName?.substring(0, 2).toUpperCase() || member.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[hsl(var(--dark-grey))]">
                          {member.displayName || member.email}
                          {isCurrentUser && " (You)"}
                        </h3>
                        <Badge className={getAccessBadgeColor(member.accessLevel)}>{formatAccessLevel(member.accessLevel)}</Badge>
                      </div>
                      <p className="text-sm text-[hsl(var(--medium-grey))]">{member.email}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[hsl(var(--medium-grey))] mt-1">
                        <span>Joined {new Date(member.joinedAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}</span>
                        {member.lastActiveAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last active: {new Date(member.lastActiveAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[hsl(var(--bold-royal-blue))]">Invite a Colleague</DialogTitle>
            <DialogDescription>Invite someone at @{userDomain} to access this hub</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder={`colleague@${userDomain}`}
                className="mt-1.5"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="access">What can they access?</Label>
              <Select value={accessLevel} onValueChange={(v) => setAccessLevel(v as AccessLevel)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_access">Everything I can see</SelectItem>
                  <SelectItem value="proposal_only">Proposal only</SelectItem>
                  <SelectItem value="documents_only">Documents only</SelectItem>
                  <SelectItem value="view_only">View only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Personal message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Hi, I've invited you to view our AgentFlow project..."
                className="mt-1.5"
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
              className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
              onClick={handleInvite}
              disabled={isInviting}
            >
              {isInviting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
