"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../page-header";
import { mockTrip, getCurrentUserHousehold, mockActivityResponses, type Task } from "@/lib/mock-data";
import {
  Plane,
  Building2,
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageCircle,
  Bell,
  MapPin,
  Calendar,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Context = "my-plan" | "groups";

interface DetailViewProps {
  itemId: string;
  itemType: "flights" | "hotel" | "insurance" | "activity";
  onBack: () => void;
  context?: Context;
  onUpdateRequiredTaskStatus?: (taskId: string, status: "not-started" | "in-progress" | "completed") => void;
  getRequiredTaskStatus?: (task: Task) => "not-started" | "in-progress" | "completed";
  onUpdateActivityResponse?: (activityId: string, response: "no-response" | "going" | "not-going") => void;
  getActivityResponse?: (activityId: string) => "no-response" | "going" | "not-going";
}

const itemConfig = {
  flights: {
    icon: Plane,
    title: "Flights",
    description: "Round-trip flights for all travelers",
    notes: "Departing June 15 from LAX at 8:45 AM, returning June 22 at 6:30 PM. All travelers on same flights.",
  },
  hotel: {
    icon: Building2,
    title: "Hotel",
    description: "Beachfront resort accommodation",
    notes: "Beachfront Ocean Resort, Cabo San Lucas. Check-in June 15 after 3 PM, check-out June 22 before 11 AM.",
  },
  insurance: {
    icon: Shield,
    title: "Travel Insurance",
    description: "Trip protection coverage for all travelers",
    notes: "Coverage includes trip cancellation, medical emergencies, and baggage protection. Deadline: May 15, 2026.",
  },
  activity: {
    icon: CheckCircle2,
    title: "Snorkeling Tour",
    description: "Guided reef exploration activity",
    notes: "Group discount available. Tour operates daily 9 AM - 2 PM. 4-hour tour with lunch included.",
  },
};

export function SharedDetailView({
  itemId,
  itemType,
  onBack,
  context = "groups",
  onUpdateRequiredTaskStatus,
  getRequiredTaskStatus,
  onUpdateActivityResponse,
  getActivityResponse,
}: DetailViewProps) {
  const config = itemConfig[itemType];
  const Icon = config.icon;
  const userHousehold = getCurrentUserHousehold();
  const [groupsExpanded, setGroupsExpanded] = useState(context === "groups");

  // Get user's status for this item
  const userTask = userHousehold.tasks.find(t => t.category === itemType);
  const isActivity = itemType === "activity";

  // For required tasks: use status-based model
  const currentRequiredTaskStatus = userTask && !isActivity && getRequiredTaskStatus
    ? getRequiredTaskStatus(userTask)
    : !isActivity ? (userTask?.status as "not-started" | "in-progress" | "completed" || "not-started")
      : "not-started";

  const isUserComplete = !isActivity && currentRequiredTaskStatus === "completed";
  const isUserInProgress = !isActivity && currentRequiredTaskStatus === "in-progress";

  // For activities: use response-based model
  const currentActivityResponse = isActivity && getActivityResponse
    ? getActivityResponse(userTask?.id || "")
    : isActivity
    ? "no-response"
    : "no-response";

  // Get group data - different logic for required tasks vs activities
  let groupData: Array<{
    name: string;
    response: "no-response" | "going" | "not-going" | "not-started" | "in-progress" | "completed";
    isUser: boolean;
  }> = [];

  if (isActivity) {
    // For activities: use stable mock data for group responses
    // Current user's response comes from shared state, others from mock data
    groupData = mockTrip.households.map(household => {
      const isCurrentUser = household.id === userHousehold.id;
      let response: "no-response" | "going" | "not-going";
      
      if (isCurrentUser) {
        // Current user's response from shared state
        response = currentActivityResponse;
      } else {
        // Other households use stable mock data
        response = mockActivityResponses["snorkeling"]?.[household.id] ?? "no-response";
      }
      
      return {
        name: household.name,
        response,
        isUser: isCurrentUser,
      };
    });
  } else {
    // For required tasks: build from task status
    groupData = mockTrip.households.map(household => {
      const task = household.tasks.find(t => t.category === itemType);
      return {
        name: household.name,
        response: task?.status || "not-started",
        isUser: household.id === userHousehold.id,
      };
    });
  }

  // For required tasks: count by status
  const completeCount = !isActivity ? groupData.filter(g => g.response === "completed").length : 0;
  const totalGroups = groupData.length;
  const progressPercent = !isActivity ? Math.round((completeCount / totalGroups) * 100) : 0;

  // For activities: count by response
  const goingCount = isActivity ? groupData.filter(g => g.response === "going").length : 0;
  const notGoingCount = isActivity ? groupData.filter(g => g.response === "not-going").length : 0;
  const noResponseCount = isActivity ? groupData.filter(g => g.response === "no-response").length : 0;

  return (
    <div>
      <PageHeader
        title={config.title}
        subtitle={config.description}
        onBack={onBack}
      />

      <div style={{ padding: '24px 32px 100px' }}>
        <div className="space-y-6">
          {/* Your Status - Always First */}
          <Card className={`border-2 p-6 sm:p-8 ${isActivity
              ? currentActivityResponse === "no-response"
                ? "border-border/50 bg-muted/20"
                : currentActivityResponse === "going"
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              : isUserComplete
                ? "border-emerald-200 bg-emerald-50"
                : isUserInProgress
                  ? "border-primary/20 bg-primary/5"
                  : "border-border/50 bg-muted/20"
            }`}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`rounded-xl p-3 ${isActivity
                  ? currentActivityResponse === "no-response"
                    ? "bg-muted"
                    : currentActivityResponse === "going"
                      ? "bg-emerald-100"
                      : "bg-amber-100"
                  : isUserComplete
                    ? "bg-emerald-100"
                    : "bg-muted"
                }`}>
                <Icon className={`h-6 w-6 ${isActivity
                    ? currentActivityResponse === "no-response"
                      ? "text-muted-foreground"
                      : currentActivityResponse === "going"
                        ? "text-emerald-700"
                        : "text-amber-700"
                    : isUserComplete
                      ? "text-emerald-700"
                      : "text-muted-foreground"
                  }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {isActivity ? "Your Response" : "Your Status"}
                  </h3>
                  {isActivity && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${currentActivityResponse === "going"
                        ? "bg-emerald-100 text-emerald-700"
                        : currentActivityResponse === "not-going"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                      {currentActivityResponse === "going" ? "Going" : currentActivityResponse === "not-going" ? "Not going" : "Not decided"}
                    </span>
                  )}
                  {!isActivity && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-md ${isUserComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : isUserInProgress
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}>
                      {isUserComplete ? "✓ Booked" : isUserInProgress ? "In progress" : "Not started"}
                    </span>
                  )}
                </div>
                {isActivity ? (
                  <p className="text-sm text-muted-foreground">
                    {currentActivityResponse === "no-response" ? "Let us know if you're interested" : ""}
                  </p>
                ) : (
                  <>
                    {isUserComplete && (
                      <p className="text-sm text-emerald-700 font-medium">You&apos;ve booked {config.title.toLowerCase()}</p>
                    )}
                    {isUserInProgress && (
                      <p className="text-sm text-primary font-medium">You&apos;re working on booking {config.title.toLowerCase()}</p>
                    )}
                    {!isUserComplete && !isUserInProgress && (
                      <p className="text-sm text-muted-foreground">You still need to book {config.title.toLowerCase()}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* CTAs */}
            {isActivity ? (
              <div className="flex flex-wrap gap-3">
                <Button
                  className={`gap-2 ${currentActivityResponse === "going" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  onClick={() => {
                    const newResponse = currentActivityResponse === "going" ? "no-response" : "going";
                    onUpdateActivityResponse?.(userTask?.id || "", newResponse);
                  }}
                >
                  {currentActivityResponse === "going" ? "✓ I'm in" : "I'm in"}
                </Button>
                <Button
                  variant={currentActivityResponse === "not-going" ? "default" : "outline"}
                  className={`gap-2 ${currentActivityResponse === "not-going" ? "bg-amber-600 hover:bg-amber-700 border-amber-600" : ""}`}
                  onClick={() => {
                    const newResponse = currentActivityResponse === "not-going" ? "no-response" : "not-going";
                    onUpdateActivityResponse?.(userTask?.id || "", newResponse);
                  }}
                >
                  {currentActivityResponse === "not-going" ? "✓ Not going" : "Not going"}
                </Button>
              </div>
            ) : (
              <>
                {isUserComplete ? (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, "in-progress")}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 text-amber-600 hover:text-amber-700 border-amber-600/30 hover:border-amber-600"
                      onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, "not-started")}
                    >
                      Mark as not booked
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="gap-2"
                      onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, isUserInProgress ? "completed" : "in-progress")}
                    >
                      {isUserInProgress ? "Mark as done" : "Get started"}
                    </Button>
                    {!isUserInProgress && (
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, "completed")}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Already done
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}
          </Card>

          {/* Group Progress - Collapsible based on context */}
          <Card className="border-border/50 p-6">
            <button
              type="button"
              onClick={() => setGroupsExpanded(!groupsExpanded)}
              className="w-full flex items-center justify-between hover:opacity-75 transition-opacity"
            >
              <div className="flex items-center justify-between flex-1">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {isActivity ? "Who's Going" : "Group Progress"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isActivity ? (
                      <>
                        {goingCount} going • {notGoingCount} not going • {noResponseCount} {noResponseCount === 1 ? "group" : "groups"} no response
                      </>
                    ) : (
                      `${completeCount} of ${totalGroups} households have booked`
                    )}
                  </p>
                </div>
                <div className="text-right mr-3">
                  <p className="text-3xl font-bold text-foreground">{progressPercent}%</p>
                  <p className="text-xs text-muted-foreground">{isActivity ? "Responses" : "Complete"}</p>
                </div>
              </div>
              {groupsExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>

            {/* Missing responses indicator for activities */}
            {isActivity && noResponseCount > 0 && !groupsExpanded && (
              <p className="text-xs text-amber-600 mt-3 font-medium">
                {noResponseCount} {noResponseCount === 1 ? "group hasn't" : "groups haven't"} responded yet
              </p>
            )}

            {/* Expandable Group Details */}
            {groupsExpanded && (
              <div className="mt-6 space-y-4">
                {!isActivity && (
                  <>
                    {/* Progress bar */}
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    {/* Group breakdown */}
                    <div className="space-y-3">
                      {groupData.map((group) => (
                        <div key={group.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-sm font-medium text-foreground truncate">{group.name}</span>
                            {group.isUser && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary whitespace-nowrap">
                                You
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                            {group.response === "completed" && (
                              <div className="flex items-center gap-1.5 text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Booked</span>
                              </div>
                            )}
                            {group.response === "in-progress" && (
                              <div className="flex items-center gap-1.5 text-amber-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">In progress</span>
                              </div>
                            )}
                            {group.response === "not-started" && (
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Not started</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3 text-xs gap-1"
                                >
                                  <Bell className="h-3.5 w-3.5" />
                                  Remind
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {isActivity && (
                  <>
                    {/* Activity response summary */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                        <p className="text-2xl font-bold text-emerald-700">{goingCount}</p>
                        <p className="text-xs text-emerald-600 font-medium">Going</p>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-2xl font-bold text-amber-700">{notGoingCount}</p>
                        <p className="text-xs text-amber-600 font-medium">Not going</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted border border-border">
                        <p className="text-2xl font-bold text-muted-foreground">{noResponseCount}</p>
                        <p className="text-xs text-muted-foreground font-medium">No response</p>
                      </div>
                    </div>

                    {/* Group breakdown for activity */}
                    <div className="space-y-2">
                      {groupData.map((group) => (
                        <div key={group.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="text-sm font-medium text-foreground truncate">{group.name}</span>
                            {group.isUser && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary whitespace-nowrap">
                                You
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                            {group.response === "going" && (
                              <div className="flex items-center gap-1.5 text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Going</span>
                              </div>
                            )}
                            {group.response === "not-going" && (
                              <div className="flex items-center gap-1.5 text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Not going</span>
                              </div>
                            )}
                            {group.response === "no-response" && (
                              <span className="text-sm text-muted-foreground">No response</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>

          {/* Details / Requirements */}
          <Card className="border-border/50 p-6">
            <h3 className="font-semibold text-foreground mb-4">Details & Requirements</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Dates</p>
                  <p className="text-sm text-muted-foreground mt-0.5">June 15 - 22, 2026</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Cabo San Lucas, Mexico</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">Organizer Notes</p>
                <p className="text-sm text-muted-foreground">{config.notes}</p>
              </div>
            </div>
          </Card>

          {/* Discussion Section */}
          <Card className="border-border/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">
                {isActivity ? "Discussion & Interest" : "Discussion"}
              </h3>
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">3 messages</span>
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <p className="text-sm text-muted-foreground">Does anyone want to book the snorkeling tour together? I found a group discount.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">Ana Martinez</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
                <p className="text-sm text-muted-foreground">Yes! How much is the discount? We&apos;re definitely interested.</p>
              </div>

              <div className="bg-primary/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">You</p>
                  <p className="text-xs text-muted-foreground">30 minutes ago</p>
                </div>
                <p className="text-sm text-muted-foreground">Count us in! I&apos;ll send the booking link to everyone.</p>
              </div>
            </div>

            {/* Input */}
            <div className="flex items-end gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button size="sm" variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
