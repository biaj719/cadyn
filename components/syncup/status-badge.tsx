import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

type Status = "not-started" | "in-progress" | "completed";

interface StatusBadgeProps {
  status: Status;
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusConfig = {
  "not-started": {
    label: "Not started",
    icon: Circle,
    className: "bg-muted text-muted-foreground",
  },
  "in-progress": {
    label: "In progress",
    icon: Clock,
    className: "bg-amber-100 text-amber-700",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-emerald-100 text-emerald-700",
  },
};

export function StatusBadge({ status, showLabel = true, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.className,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {showLabel && config.label}
    </span>
  );
}
