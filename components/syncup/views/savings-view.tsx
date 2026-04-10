"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../page-header";
import { 
  getCurrentUserSavings, 
  getDaysUntilTrip, 
  mockTrip 
} from "@/lib/mock-data";
import { 
  PiggyBank, 
  Target, 
  Calendar, 
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export function SavingsView() {
  const savings = getCurrentUserSavings();
  const daysUntilTrip = getDaysUntilTrip(mockTrip.startDate);
  const weeksUntilTrip = Math.ceil(daysUntilTrip / 7);
  
  const progress = Math.round((savings.saved / savings.goal) * 100);
  const remaining = savings.goal - savings.saved;
  const weeklyPace = weeksUntilTrip > 0 ? Math.ceil(remaining / weeksUntilTrip) : 0;
  const isComplete = progress >= 100;
  const isOnTrack = savings.status === "on-track";

  return (
    <div>
      <PageHeader 
        title="Your Savings" 
        subtitle="Stay on track for Cabo"
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Progress Card */}
          <Card className="border-border/50 p-6 lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Progress Ring */}
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 2.64} 264`}
                    className={isComplete ? "text-emerald-500" : "text-primary"}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isComplete ? (
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-foreground">{progress}%</span>
                      <span className="text-sm text-muted-foreground">saved</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Details */}
              <div className="flex-1 text-center sm:text-left">
                {/* Status message */}
                {isComplete ? (
                  <div className="mb-4">
                    <p className="text-xl font-semibold text-emerald-700">Goal Complete!</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You&apos;ve reached your savings target
                    </p>
                  </div>
                ) : isOnTrack ? (
                  <div className="mb-4">
                    <p className="text-xl font-semibold text-foreground">On Track</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      You&apos;re meeting your savings pace
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-xl font-semibold text-amber-700">Behind Schedule</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Increase weekly savings to get back on track
                    </p>
                  </div>
                )}
                
                {/* Amounts */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      ${savings.saved.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Saved</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      ${savings.goal.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Goal</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Side Cards */}
          <div className="space-y-4">
            {/* Stats */}
            <Card className="border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    ${remaining.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-border/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {weeksUntilTrip}
                  </p>
                  <p className="text-sm text-muted-foreground">Weeks until trip</p>
                </div>
              </div>
            </Card>

            {/* Suggested Pace */}
            {!isComplete && remaining > 0 && (
              <Card className="border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      ${weeklyPace}/week
                    </p>
                    <p className="text-sm text-muted-foreground">to stay on track</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Action */}
            <Button className="w-full h-12" size="lg">
              <PiggyBank className="h-5 w-5 mr-2" />
              Add to savings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
