"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "../page-header";
import { mockTrip } from "@/lib/mock-data";
import { Plane, BedDouble, Compass, Shield, CheckCircle2, Clock, Circle } from "lucide-react";

// Aggregate task data by category
function getTasksByCategory() {
  const categories = ["flights", "hotel", "insurance"] as const;
  
  return categories.map((category) => {
    const tasks = mockTrip.households.map((h) => ({
      householdName: h.name,
      task: h.tasks.find((t) => t.category === category),
    }));
    
    const completed = tasks.filter((t) => t.task?.status === "completed").length;
    const inProgress = tasks.filter((t) => t.task?.status === "in-progress").length;
    const notStarted = tasks.filter((t) => t.task?.status === "not-started").length;
    
    return {
      category,
      tasks,
      completed,
      inProgress,
      notStarted,
      total: tasks.length,
    };
  });
}

const categoryConfig = {
  flights: { label: "Flights", icon: Plane },
  hotel: { label: "Hotel", icon: BedDouble },
  insurance: { label: "Travel Insurance", icon: Shield },
};

export function PlanCoordinationView() {
  const tasksByCategory = getTasksByCategory();

  return (
    <div>
      <PageHeader 
        title="Plan Coordination" 
        subtitle="Track progress by task type"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasksByCategory.map((categoryData) => {
            const config = categoryConfig[categoryData.category];
            const Icon = config.icon;
            const allComplete = categoryData.completed === categoryData.total;
            
            return (
              <Card key={categoryData.category} className="border-border/50 p-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-3 ${allComplete ? "bg-emerald-100" : "bg-muted"}`}>
                    <Icon className={`h-6 w-6 ${allComplete ? "text-emerald-700" : "text-muted-foreground"}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-foreground">{config.label}</h3>
                      <span className="text-sm text-muted-foreground">
                        {categoryData.completed}/{categoryData.total}
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full transition-all ${allComplete ? "bg-emerald-500" : "bg-primary"}`}
                        style={{ width: `${(categoryData.completed / categoryData.total) * 100}%` }}
                      />
                    </div>
                    
                    {/* Status breakdown */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {categoryData.completed} done
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-amber-600" />
                        {categoryData.inProgress}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Circle className="h-3.5 w-3.5" />
                        {categoryData.notStarted}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Household details */}
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {categoryData.tasks.map(({ householdName, task }) => (
                    <div 
                      key={householdName} 
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">{householdName}</span>
                      <span className="flex items-center gap-1.5">
                        {task?.status === "completed" && (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700">Done</span>
                          </>
                        )}
                        {task?.status === "in-progress" && (
                          <>
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-700">In progress</span>
                          </>
                        )}
                        {task?.status === "not-started" && (
                          <>
                            <Circle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Not started</span>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Insight card */}
        <Card className="border-primary/30 bg-primary/5 p-5 mt-6">
          <p className="text-foreground">
            <span className="font-semibold">Quick summary:</span>{" "}
            {tasksByCategory[0].completed === tasksByCategory[0].total 
              ? "All flights are booked. " 
              : `${Math.round((tasksByCategory[0].completed / tasksByCategory[0].total) * 100)}% of flights are booked. `
            }
            {tasksByCategory[1].completed === tasksByCategory[1].total 
              ? "All hotels are confirmed." 
              : `${tasksByCategory[1].total - tasksByCategory[1].completed} household${tasksByCategory[1].total - tasksByCategory[1].completed > 1 ? "s" : ""} still need${tasksByCategory[1].total - tasksByCategory[1].completed === 1 ? "s" : ""} to book a hotel.`
            }
          </p>
        </Card>
      </div>
    </div>
  );
}
