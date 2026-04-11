"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../page-header";
import { StatusBadge } from "../status-badge";
import type { Task, Household } from "@/lib/mock-data";
import { mockTrip } from "@/lib/mock-data";
import { 
  Plane,
  BedDouble,
  Shield, 
  CheckCircle2, 
  Clock, 
  Bell,
  ExternalLink,
  Users,
  Check,
} from "lucide-react";

interface TaskDetailViewProps {
  task: Task;
  household: Household;
  onBack: () => void;
  onMarkComplete?: () => void;
}

const categoryConfig = {
  flights: {
    icon: Plane,
    label: "Flights",
    tips: [
      "Compare prices across multiple airlines",
      "Book early for better rates",
      "Consider travel times for the group",
    ],
    links: [
      { label: "Google Flights", url: "#" },
      { label: "Expedia", url: "#" },
    ],
  },
  hotel: {
    icon: BedDouble,
    label: "Hotel",
    tips: [
      "Check if the resort has group rates",
      "Verify cancellation policies",
      "Confirm room types match your needs",
    ],
    links: [
      { label: "Booking.com", url: "#" },
      { label: "Hotels.com", url: "#" },
    ],
  },
  insurance: {
    icon: Shield,
    label: "Travel Insurance",
    tips: [
      "Look for trip cancellation coverage",
      "Check medical coverage limits",
      "Verify coverage for activities planned",
    ],
    links: [
      { label: "World Nomads", url: "#" },
      { label: "Allianz Travel", url: "#" },
    ],
  },
  other: {
    icon: CheckCircle2,
    label: "Task",
    tips: [],
    links: [],
  },
};

export function TaskDetailView({ task, household, onBack, onMarkComplete }: TaskDetailViewProps) {
  const config = categoryConfig[task.category];
  const Icon = config.icon;
  const isCompleted = task.status === "completed";
  const isInProgress = task.status === "in-progress";

  // Get other households' status for this task category
  const otherHouseholdsStatus = mockTrip.households
    .filter(h => h.id !== household.id)
    .map(h => {
      const matchingTask = h.tasks.find(t => t.category === task.category);
      return {
        name: h.name,
        status: matchingTask?.status || "not-started",
      };
    });

  const completedCount = otherHouseholdsStatus.filter(h => h.status === "completed").length;

  return (
    <div>
      <PageHeader
        title={task.title}
        subtitle={config.label}
        onBack={onBack}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status card */}
            <Card className="border-border/50 p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className={`rounded-xl p-3 ${isCompleted ? "bg-emerald-100" : isInProgress ? "bg-amber-100" : "bg-muted"}`}>
                  <Icon className={`h-6 w-6 ${isCompleted ? "text-emerald-700" : isInProgress ? "text-amber-700" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h2 className="font-semibold text-lg text-foreground">{task.title}</h2>
                    <StatusBadge status={task.status} size="sm" />
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {task.description}
                  </p>
                  
                  {isCompleted && (
                    <div className="mt-4 flex items-center gap-1.5 text-sm text-emerald-700">
                      <Check className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Primary action */}
              {!isCompleted && (
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <Button className="w-full sm:w-auto h-11 px-6" size="lg" onClick={onMarkComplete}>
                    {isInProgress ? "Mark as complete" : "Get started"}
                  </Button>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2">
                      <Bell className="h-4 w-4" />
                      Set reminder
                    </Button>
                    <Button variant="ghost" className="text-muted-foreground">
                      Already done
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Group context */}
            <Card className="border-border/50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-muted p-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Group Status</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedCount} of {otherHouseholdsStatus.length} other households have completed this
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {otherHouseholdsStatus.map((h) => (
                  <div key={h.name} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">{h.name}</span>
                    <span className="flex items-center gap-1.5">
                      {h.status === "completed" && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-700">Done</span>
                        </>
                      )}
                      {h.status === "in-progress" && (
                        <>
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-amber-700">In progress</span>
                        </>
                      )}
                      {h.status === "not-started" && (
                        <span className="text-muted-foreground">Not started</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            {config.tips.length > 0 && (
              <Card className="border-border/50 p-5">
                <h3 className="font-semibold text-foreground mb-4">Tips</h3>
                <ul className="space-y-3">
                  {config.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Helpful links */}
            {config.links.length > 0 && (
              <Card className="border-border/50 p-5">
                <h3 className="font-semibold text-foreground mb-4">Helpful Links</h3>
                <div className="space-y-2">
                  {config.links.map((link) => (
                    <a 
                      key={link.label}
                      href={link.url}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">{link.label}</span>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
