"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Household } from "@/lib/mock-data";
import { getHouseholdProgress } from "@/lib/mock-data";
import { Users, Bell, Check, ChevronRight } from "lucide-react";

interface HouseholdCardProps {
  household: Household;
  showReminder?: boolean;
  onClick?: () => void;
}

export function HouseholdCard({ household, showReminder = true, onClick }: HouseholdCardProps) {
  const progress = getHouseholdProgress(household);
  const completedTasks = household.tasks.filter((t) => t.status === "completed").length;
  const isComplete = progress === 100;

  return (
    <Card 
      className="border-border/50 p-4 transition-all hover:border-border hover:shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-2.5 ${isComplete ? "bg-emerald-100" : "bg-muted"}`}>
          <Users className={`h-5 w-5 ${isComplete ? "text-emerald-700" : "text-muted-foreground"}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">{household.name}</h3>
            {isComplete ? (
              <span className="flex items-center gap-1 text-sm text-emerald-700">
                <Check className="h-4 w-4" />
                Complete
              </span>
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          
          <p className="mt-0.5 text-sm text-muted-foreground">
            {household.members.join(", ")}
          </p>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {completedTasks} of {household.tasks.length} tasks
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {showReminder && !isComplete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Bell className="h-3.5 w-3.5" />
              Send reminder
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
