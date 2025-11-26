import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "client" | "agentflow";
  content: string;
  timestamp: string;
}

interface Thread {
  id: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
  isProposalComment?: boolean;
}

const threads: Thread[] = [
  {
    id: "1",
    subject: "Re: Questions about timeline",
    preview: "Thanks for your question. Regarding the timeline...",
    timestamp: "2h ago",
    unread: true,
    messages: [
      {
        id: "1",
        sender: "client",
        content: "Hi, I had a quick question about the timeline on slide 7. Is this flexible if we need to adjust the launch date?",
        timestamp: "Nov 22, 10:15 AM"
      },
      {
        id: "2",
        sender: "agentflow",
        content: "Thanks for your question, Sarah! The timeline we proposed is flexible. We've built in some buffer time to account for adjustments. If you need to move the launch date, we can definitely work with that. Would you like to schedule a quick call to discuss the specifics?",
        timestamp: "Nov 22, 2:30 PM"
      },
      {
        id: "3",
        sender: "client",
        content: "That makes sense, thanks for clarifying! A call would be great. I'll check our calendar and get back to you with some times that work.",
        timestamp: "2h ago"
      }
    ]
  },
  {
    id: "2",
    subject: "Re: Your comment on Slide 5",
    preview: "Great question about the pricing structure...",
    timestamp: "Yesterday",
    unread: true,
    isProposalComment: true,
    messages: [
      {
        id: "1",
        sender: "client",
        content: "Can you explain more about the pricing structure shown on this slide? I want to make sure I understand the breakdown correctly.",
        timestamp: "Nov 23, 3:20 PM"
      },
      {
        id: "2",
        sender: "agentflow",
        content: "Great question about the pricing structure! The breakdown shows our fixed costs vs. variable costs. The fixed portion covers the core platform setup and configuration, while the variable portion scales with your usage. I can walk you through this in more detail if that would be helpful.",
        timestamp: "Yesterday, 9:45 AM"
      }
    ]
  },
  {
    id: "3",
    subject: "Proposal ready for review",
    preview: "Hi Sarah, We're excited to share...",
    timestamp: "Nov 22",
    unread: false,
    messages: [
      {
        id: "1",
        sender: "agentflow",
        content: "Hi Sarah, We're excited to share our proposal with you! We've put together a comprehensive plan that we think addresses all of your key objectives. Please take a look and let us know if you have any questions. We're here to help!",
        timestamp: "Nov 22, 9:00 AM"
      },
      {
        id: "2",
        sender: "client",
        content: "Thank you! I'll review it today and reach out with any questions.",
        timestamp: "Nov 22, 11:30 AM"
      }
    ]
  },
  {
    id: "4",
    subject: "Welcome to your hub",
    preview: "Hi Sarah, Welcome to your AgentFlow...",
    timestamp: "Nov 18",
    unread: false,
    messages: [
      {
        id: "1",
        sender: "agentflow",
        content: "Hi Sarah, Welcome to your AgentFlow hub! This is your central place to access all materials related to our proposal. You'll find videos, documents, and can message us directly through this platform. Looking forward to working with you!",
        timestamp: "Nov 18, 2:00 PM"
      }
    ]
  }
];

export function ClientMessagesSection() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(threads[0]);
  const [replyText, setReplyText] = useState("");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showThreadList, setShowThreadList] = useState(true);
  const { toast } = useToast();

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedThread) return;

    toast({
      title: "Message sent",
      description: "Your message has been sent to the AgentFlow team",
    });
    setReplyText("");
  };

  const handleSendNewMessage = () => {
    if (!newSubject.trim() || !newMessage.trim()) return;

    toast({
      title: "Message sent",
      description: "Your message has been sent to the AgentFlow team",
    });
    setNewMessageOpen(false);
    setNewSubject("");
    setNewMessage("");
  };

  const handleThreadSelect = (thread: Thread) => {
    setSelectedThread(thread);
    setShowThreadList(false);
  };

  const handleBackToList = () => {
    setShowThreadList(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--bold-royal-blue))] mb-2">
            Messages
          </h1>
        </div>
        <Button
          className="bg-[hsl(var(--soft-coral))] hover:bg-[hsl(var(--soft-coral))]/90 text-white"
          onClick={() => setNewMessageOpen(true)}
        >
          New Message
        </Button>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
        {/* Thread List - Left Panel */}
        <div className={cn(
          "lg:col-span-1",
          !showThreadList && "hidden lg:block"
        )}>
          <Card className="h-full">
            <CardContent className="p-0">
              <ScrollArea className="h-full">
                <div className="divide-y">
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      className={cn(
                        "p-4 cursor-pointer transition-colors hover:bg-[hsl(var(--warm-cream))]/50",
                        thread.unread && "bg-blue-50/50",
                        selectedThread?.id === thread.id && "border-l-4 border-[hsl(var(--gradient-blue))] bg-[hsl(var(--warm-cream))]/50"
                      )}
                      onClick={() => handleThreadSelect(thread)}
                    >
                      <div className="flex items-start gap-3">
                        {thread.unread && (
                          <div className="w-2 h-2 rounded-full bg-[hsl(var(--gradient-blue))] mt-2 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={cn(
                              "text-sm text-[hsl(var(--medium-grey))]",
                              thread.unread && "font-semibold text-[hsl(var(--dark-grey))]"
                            )}>
                              AgentFlow Team
                            </p>
                            <span className="text-xs text-[hsl(var(--medium-grey))] whitespace-nowrap">
                              {thread.timestamp}
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm mb-1 truncate",
                            thread.unread ? "font-semibold text-[hsl(var(--dark-grey))]" : "text-[hsl(var(--dark-grey))]"
                          )}>
                            {thread.subject}
                          </p>
                          <p className="text-xs text-[hsl(var(--medium-grey))] truncate">
                            {thread.preview}
                          </p>
                          {thread.isProposalComment && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[hsl(var(--gradient-purple))]/20 text-[hsl(var(--rich-violet))]">
                                Proposal Comment
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Thread View - Right Panel */}
        <div className={cn(
          "lg:col-span-2",
          showThreadList && "hidden lg:block"
        )}>
          <Card className="h-full flex flex-col">
            {selectedThread ? (
              <>
                {/* Thread Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3 mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="lg:hidden"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-[hsl(var(--dark-grey))]">
                        {selectedThread.subject}
                      </h2>
                      <p className="text-sm text-[hsl(var(--medium-grey))]">
                        Started {selectedThread.timestamp}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedThread.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === "client" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg p-4",
                            message.sender === "client"
                              ? "bg-[hsl(var(--gradient-blue))] text-white"
                              : "bg-white border"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.sender === "agentflow" && (
                              <img
                                src="https://www.goagentflow.com/assets/images/AgentFlowLogo.svg"
                                alt="AgentFlow"
                                className="h-4"
                              />
                            )}
                            <span className={cn(
                              "text-xs font-semibold",
                              message.sender === "client"
                                ? "text-white/90"
                                : "text-[hsl(var(--dark-grey))]"
                            )}>
                              {message.sender === "client" ? "You" : "AgentFlow Team"}
                            </span>
                            <span className={cn(
                              "text-xs",
                              message.sender === "client"
                                ? "text-white/70"
                                : "text-[hsl(var(--medium-grey))]"
                            )}>
                              {message.timestamp}
                            </span>
                          </div>
                          <p className={cn(
                            "text-sm",
                            message.sender === "client"
                              ? "text-white"
                              : "text-[hsl(var(--dark-grey))]"
                          )}>
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Reply Composer */}
                <div className="p-4 border-t bg-white">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach file
                      </Button>
                      <Button
                        className="bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-3">
                  <Mail className="h-16 w-16 text-[hsl(var(--medium-grey))] mx-auto" />
                  <div>
                    <p className="text-lg font-semibold text-[hsl(var(--dark-grey))]">
                      Select a conversation to view
                    </p>
                    <p className="text-sm text-[hsl(var(--medium-grey))]">
                      Choose a thread from the list to read and reply
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* New Message Modal */}
      <Dialog open={newMessageOpen} onOpenChange={setNewMessageOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-[hsl(var(--bold-royal-blue))]">
              New Message
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-subject">Subject</Label>
              <Input
                id="new-subject"
                placeholder="Enter subject..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-message">Message</Label>
              <Textarea
                id="new-message"
                placeholder="Type your message..."
                rows={8}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-[hsl(var(--medium-grey))]">
              <Mail className="h-4 w-4" />
              <p>Your message will be sent to the AgentFlow team</p>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[hsl(var(--gradient-blue))] hover:bg-[hsl(var(--gradient-blue))]/90"
                onClick={handleSendNewMessage}
                disabled={!newSubject.trim() || !newMessage.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setNewMessageOpen(false);
                  setNewSubject("");
                  setNewMessage("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
