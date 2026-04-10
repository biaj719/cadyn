"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CountdownCard } from "../countdown-card";
import { ProgressRing } from "../progress-ring";
import { 
  mockTrip, 
  getTripProgress,
  getTaskCounts,
  getNeedsAttention,
} from "@/lib/mock-data";
import { 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Circle,
  Zap,
  Settings,
} from "lucide-react";

interface OrganizerOverviewViewProps {
  onNavigate: (view: string) => void;
}

export function OrganizerOverviewView({ onNavigate }: OrganizerOverviewViewProps) {
  const tripProgress = getTripProgress(mockTrip);
  const taskCounts = getTaskCounts(mockTrip);
  const needsAttention = getNeedsAttention(mockTrip);
  
  // Calculate group momentum
  const completedHouseholds = mockTrip.households.filter(
    h => h.tasks.every(t => t.status === "completed")
  ).length;
  const momentum = completedHouseholds >= mockTrip.households.length / 2 
    ? "strong" 
    : taskCounts.inProgress > taskCounts.notStarted 
      ? "building" 
      : "needs-push";

  const momentumConfig = {
    strong: { label: "Strong momentum", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    building: { label: "Building momentum", color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
    "needs-push": { label: "Needs a push", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border lg:static lg:bg-transparent lg:border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider">Organizer Dashboard</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mt-1">{mockTrip.name}</h1>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{taskCounts.completed}</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </Card>
          <Card className="border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2.5">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{taskCounts.inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>
          <Card className="border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2.5">
                <Circle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{taskCounts.notStarted}</p>
                <p className="text-xs text-muted-foreground">Not Started</p>
              </div>
            </div>
          </Card>
          <Card className="border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{tripProgress}%</p>
                <p className="text-xs text-muted-foreground">Overall</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero countdown card */}
            <CountdownCard 
              destination={mockTrip.destination}
              startDate={mockTrip.startDate}
              endDate={mockTrip.endDate}
            />

            {/* Trip Energy / Momentum */}
            <Card className={`p-5 ${momentumConfig[momentum].bg} ${momentumConfig[momentum].border}`}>
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-background/80 p-3">
                  {momentum === "strong" ? (
                    <TrendingUp className={`h-6 w-6 ${momentumConfig[momentum].color}`} />
                  ) : momentum === "building" ? (
                    <Zap className={`h-6 w-6 ${momentumConfig[momentum].color}`} />
                  ) : (
                    <Clock className={`h-6 w-6 ${momentumConfig[momentum].color}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${momentumConfig[momentum].color}`}>
                    {momentumConfig[momentum].label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {completedHouseholds} of {mockTrip.households.length} households have finished all tasks
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate("group-progress")}
                >
                  View Group
                </Button>
              </div>
            </Card>

            {/* Needs Attention */}
            {needsAttention.length > 0 && (
              <div>
                <h2 className="font-semibold text-foreground mb-3">Needs Attention</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {needsAttention.slice(0, 4).map((item, index) => (
                    <Card key={index} className="border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-foreground">{item.message}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Overall Progress */}
            <Card className="border-border/50 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Overall Progress</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1 text-primary -mr-2"
                  onClick={() => onNavigate("group-progress")}
                >
                  Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center py-2">
                <ProgressRing 
                  progress={tripProgress} 
                  size={120}
                  strokeWidth={8}
                />
              </div>
              
              <div className="mt-4 text-center">
                <p className="font-medium text-foreground">
                  {taskCounts.completed} of {taskCounts.total} tasks complete
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {mockTrip.households.length} households in this trip
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50 p-5">
              <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate("group-progress")}
                >
                  <TrendingUp className="h-4 w-4" />
                  View Group Progress
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate("plan-coordination")}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Coordinate Plans
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => onNavigate("activity")}
                >
                  <Clock className="h-4 w-4" />
                  View Activity
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
