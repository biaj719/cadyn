import type { Activity } from "@/lib/mock-data";
import { Bell, Check, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";

interface ActivityItemProps {
  activity: Activity;
  isNew?: boolean;
}

const typeConfig = {
  reminder: {
    icon: Bell,
    className: "bg-amber-100 text-amber-700",
  },
  update: {
    icon: MessageCircle,
    className: "bg-sky-100 text-sky-700",
  },
  milestone: {
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700",
  },
  nudge: {
    icon: Check,
    className: "bg-muted text-muted-foreground",
  },
};

export function ActivityItem({ activity, isNew = false }: ActivityItemProps) {
  const config = typeConfig[activity.type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3">
      <div className={`rounded-lg p-2 flex-shrink-0 ${config.className}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm text-foreground">{activity.message}</p>
          {isNew && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{activity.timestamp}</p>
      </div>
    </div>
  );
}
