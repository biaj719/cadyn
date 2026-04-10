"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import type { Task } from "@/lib/mock-data";
import { Plane, Building2, Shield, ChevronRight, Check } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onAction?: () => void;
  showAction?: boolean;
}

const categoryIcons = {
  flights: Plane,
  hotel: Building2,
  insurance: Shield,
  other: ChevronRight,
};

export function TaskCard({ task, onAction, showAction = true }: TaskCardProps) {
  const Icon = categoryIcons[task.category];
  const isCompleted = task.status === "completed";

  return (
    <Card className="border-border/50 p-4 transition-all hover:border-border hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-2.5 ${isCompleted ? "bg-emerald-100" : "bg-muted"}`}>
          <Icon className={`h-5 w-5 ${isCompleted ? "text-emerald-700" : "text-muted-foreground"}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-foreground">{task.title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{task.description}</p>
            </div>
            <StatusBadge status={task.status} showLabel={false} size="sm" />
          </div>
          
          {showAction && !isCompleted && (
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" onClick={onAction}>
                {task.status === "not-started" ? "Get started" : "Continue"}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Already done
              </Button>
            </div>
          )}
          
          {isCompleted && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-emerald-700">
              <Check className="h-4 w-4" />
              <span>All set</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
