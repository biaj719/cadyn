import { Plane, BedDouble, Shield, Compass } from "lucide-react";

export const taskCategoryIcons = {
  flights: Plane,
  hotel: BedDouble,
  insurance: Shield,
  activity: Compass,
} as const;

export type TaskCategory = keyof typeof taskCategoryIcons;

export function getTaskIcon(category: string) {
  return taskCategoryIcons[category as TaskCategory] || Compass;
}
