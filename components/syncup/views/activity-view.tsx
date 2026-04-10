"use client";

import { Card } from "@/components/ui/card";
import { PageTitle, PageContent } from "../page-layout";
import { ActivityItem } from "../activity-item";
import { mockActivities, mockTrip } from "@/lib/mock-data";
import { Activity, Users } from "lucide-react";
import { 
  colors, 
  typography, 
  spacing, 
  cardStyles,
  sectionHeaderStyles,
} from "@/lib/design-tokens";

interface ActivityViewProps {
  onNavigateToItem?: (itemType: "flights" | "hotel" | "insurance" | "activity") => void;
  onNavigateToGroup?: (groupId: string) => void;
  onNavigateToWallet?: () => void;
}

export function ActivityView({ onNavigateToItem, onNavigateToGroup, onNavigateToWallet }: ActivityViewProps) {
  // Group activities by time period - only group updates (passive timeline)
  const groupedActivities = {
    today: mockActivities.filter((a) => a.timestamp.includes("ago") && !a.timestamp.includes("days")),
    yesterday: mockActivities.filter((a) => a.timestamp === "Yesterday"),
    earlier: mockActivities.filter((a) => a.timestamp.includes("days ago")),
  };

  const isEmpty = mockActivities.length === 0;

  // Determine routing based on activity content
  const getActivityRoute = (activity: any) => {
    if (activity.householdName && (activity.message.includes("booked") || activity.message.includes("completed"))) {
      const group = mockTrip.households.find(h => h.name === activity.householdName);
      return { type: "group", id: group?.id };
    }
    if (activity.message.includes("flights")) {
      return { type: "item", id: "flights" };
    }
    if (activity.message.includes("hotel")) {
      return { type: "item", id: "hotel" };
    }
    if (activity.message.includes("insurance")) {
      return { type: "item", id: "insurance" };
    }
    if (activity.message.includes("budget") || activity.message.includes("split")) {
      return { type: "wallet" };
    }
    return null;
  };

  const handleActivityClick = (activity: any) => {
    const route = getActivityRoute(activity);
    if (!route) return;

    if (route.type === "item") {
      onNavigateToItem?.(route.id as "flights" | "hotel" | "insurance" | "activity");
    } else if (route.type === "group") {
      onNavigateToGroup?.(route.id!);
    } else if (route.type === "wallet") {
      onNavigateToWallet?.();
    }
  };

  const ActivitySection = ({ title, items }: { title: string; items: any[] }) => {
    if (items.length === 0) return null;

    return (
      <div style={{ marginBottom: spacing['11'] }}>
        <div style={{
          fontSize: sectionHeaderStyles.fontSize,
          fontWeight: sectionHeaderStyles.fontWeight,
          letterSpacing: sectionHeaderStyles.letterSpacing,
          textTransform: sectionHeaderStyles.textTransform,
          color: sectionHeaderStyles.color,
          marginBottom: sectionHeaderStyles.marginBottom,
        }}>
          {title}
        </div>
        <Card style={{ ...cardStyles.default, padding: 0 }}>
          {items.map((activity, index) => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              style={{
                padding: spacing['4'],
                borderBottom: index < items.length - 1 ? `1px solid ${colors.divider}` : 'none',
                cursor: 'pointer',
              }}
              className="hover:bg-muted/20 transition-colors"
            >
              <ActivityItem activity={activity} isNew={false} />
            </div>
          ))}
        </Card>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: colors.background }}>
      <PageTitle
        icon={<Activity size={22} color="#8A847C" />}
        title="Activity"
        subtitle="What everyone's been up to"
      />
      <PageContent>
        {isEmpty ? (
          <div style={{
            textAlign: 'center',
            paddingTop: spacing['20'],
            paddingBottom: spacing['20'],
          }}>
            <Users
              size={48}
              color={colors.textTertiary}
              style={{ margin: '0 auto', marginBottom: spacing['4'] }}
            />
            <p style={{
              fontSize: typography.fontSize.lg,
              color: colors.textMuted,
              marginBottom: spacing['2'],
            }}>
              No activity yet
            </p>
            <p style={{
              fontSize: typography.fontSize.base,
              color: colors.textTertiary,
            }}>
              Activity will appear here when updates happen
            </p>
          </div>
        ) : (
          <div>
            {/* Today */}
            <ActivitySection title="Today" items={groupedActivities.today} />

            {/* Yesterday */}
            <ActivitySection title="Yesterday" items={groupedActivities.yesterday} />

            {/* Earlier */}
            <ActivitySection title="Earlier" items={groupedActivities.earlier} />
          </div>
        )}
      </PageContent>
    </div>
  );
}
