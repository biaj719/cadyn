"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "../page-header";
import { StatusBadge } from "../status-badge";
import type { Household } from "@/lib/mock-data";
import { getHouseholdProgress } from "@/lib/mock-data";
import { 
  Users, 
  Bell,
  CheckCircle2,
  Plane,
  Building2,
  Shield,
  Check,
} from "lucide-react";

interface HouseholdDetailViewProps {
  household: Household;
  onBack: () => void;
  isOrganizer?: boolean;
}

const categoryIcons = {
  flights: Plane,
  hotel: Building2,
  insurance: Shield,
  other: CheckCircle2,
};

export function HouseholdDetailView({ household, onBack, isOrganizer = false }: HouseholdDetailViewProps) {
  const [reminded, setReminded] = useState(false);
  const progress = getHouseholdProgress(household);
  const completedTasks = household.tasks.filter(t => t.status === "completed").length;
  const totalTasks = household.tasks.length;
  const isComplete = progress === 100;

  // Get missing items
  const missingItems = household.tasks
    .filter(t => t.status !== "completed")
    .map(t => {
      if (t.category === "flights") return "Flights";
      if (t.category === "hotel") return "Hotel";
      if (t.category === "insurance") return "Travel insurance";
      return t.title;
    });

  // Separate tasks into required items
  const requiredItems = household.tasks.filter(t => 
    ["flights", "hotel", "insurance"].includes(t.category)
  );

  const committedActivities = household.tasks.filter(t => t.category === "other");

  const handleRemind = () => {
    setReminded(true);
  };

  return (
    <div>
      <PageHeader
        title={household.name}
        subtitle={`${household.members.length} ${household.members.length === 1 ? "traveler" : "travelers"}`}
        onBack={onBack}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Status Overview */}
        <Card className="border-border p-6">
          <div className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">Trip progress</p>
                <p className="text-sm font-medium text-muted-foreground">{progress}%</p>
              </div>
              <Progress value={progress} className="h-2.5" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <p className="font-medium text-lg text-foreground">
                {completedTasks} of {totalTasks} tasks complete
              </p>
              
              {!isComplete && missingItems.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Missing: {missingItems.join(", ")}
                </p>
              )}
              
              {isComplete && (
                <p className="text-sm text-emerald-700 font-medium">
                  ✓ All tasks complete
                </p>
              )}
            </div>

            {/* Remind CTA */}
            {!isComplete && (
              <div className="pt-2">
                {reminded ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 px-3 py-2 rounded-lg bg-emerald-50 w-fit">
                    <Check className="h-4 w-4" />
                    Reminder sent
                  </div>
                ) : (
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={handleRemind}
                  >
                    <Bell className="h-4 w-4" />
                    Remind group
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Required Tasks */}
        <section>
          <h2 className="font-semibold text-foreground mb-4">Required for this trip</h2>
          <div className="space-y-3">
            {requiredItems.map((task) => {
              const Icon = categoryIcons[task.category];
              const isTaskComplete = task.status === "completed";
              
              return (
                <Card 
                  key={task.id} 
                  className="border-border/50 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-2.5 flex-shrink-0 ${
                      isTaskComplete 
                        ? "bg-emerald-100" 
                        : "bg-muted"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isTaskComplete 
                          ? "text-emerald-700" 
                          : "text-muted-foreground"
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Commitments */}
        {committedActivities.length > 0 && (
          <section>
            <h2 className="font-semibold text-foreground mb-4">They've committed to</h2>
            <div className="space-y-3">
              {committedActivities.map((activity) => {
                const isJoined = activity.status === "completed";
                
                return (
                  <Card 
                    key={activity.id} 
                    className="border-border/50 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-2.5 flex-shrink-0 ${
                        isJoined 
                          ? "bg-emerald-100" 
                          : "bg-muted"
                      }`}>
                        <CheckCircle2 className={`h-5 w-5 ${
                          isJoined 
                            ? "text-emerald-700" 
                            : "text-muted-foreground"
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{activity.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <StatusBadge status={activity.status} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Optional: All Complete State */}
        {isComplete && (
          <Card className="border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-100 p-3 flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">All set!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {household.name} has completed all their tasks for the trip.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
