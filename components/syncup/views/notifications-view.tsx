"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "../page-header";
import { AlertCircle, Clock, Zap, MessageCircle, ArrowRight } from "lucide-react";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  cardStyles,
  sectionHeaderStyles,
  getIconContainerStyle,
} from "@/lib/design-tokens";

interface AttentionItem {
  id: string;
  type: "action-needed" | "deadline" | "nudge" | "discussion";
  title: string;
  description: string;
  urgency: "high" | "medium" | "low";
  cta?: { label: string; onClick: () => void };
}

interface NotificationsViewProps {
  onMarkAsRead?: (id: string) => void;
  onNavigate?: (view: string) => void;
}

export function NotificationsView({ onMarkAsRead, onNavigate }: NotificationsViewProps) {
  // Mock attention items - only high-signal, action-oriented items
  const mockAttentionItems: AttentionItem[] = [
    {
      id: "1",
      type: "action-needed",
      title: "You still need to book your flight",
      description: "Booking deadline is Jun 10. Prices are rising.",
      urgency: "high",
      cta: { label: "Book now", onClick: () => onNavigate?.("my-plan") },
    },
    {
      id: "2",
      type: "deadline",
      title: "Travel insurance deadline in 2 weeks",
      description: "Coverage needed by Jun 8 for full protection.",
      urgency: "high",
      cta: { label: "Review", onClick: () => onNavigate?.("my-plan") },
    },
    {
      id: "3",
      type: "nudge",
      title: "Bianca nudged you about flights",
      description: "She's waiting on your confirmation.",
      urgency: "medium",
      cta: { label: "View details", onClick: () => onNavigate?.("my-plan") },
    },
    {
      id: "4",
      type: "discussion",
      title: "3 new messages in Flights discussion",
      description: "Group decided on new departure time.",
      urgency: "medium",
      cta: { label: "View", onClick: () => onNavigate?.("my-plan") },
    },
  ];
  const [dismissedItems, setDismissedItems] = useState<Set<string>>(new Set());

  const visibleItems = mockAttentionItems.filter(item => !dismissedItems.has(item.id));
  const highPriority = visibleItems.filter(item => item.urgency === "high");
  const mediumPriority = visibleItems.filter(item => item.urgency === "medium");

  const handleDismiss = (id: string) => {
    setDismissedItems(prev => new Set([...prev, id]));
    onMarkAsRead?.(id);
  };

  const getIconConfig = (type: string) => {
    switch (type) {
      case "action-needed":
        return { icon: Zap, bg: colors.warningLighter, text: colors.warning };
      case "deadline":
        return { icon: Clock, bg: colors.warningLighter, text: colors.warning };
      case "nudge":
        return { icon: MessageCircle, bg: colors.accentPrimaryBg, text: colors.accentPrimary };
      case "discussion":
        return { icon: MessageCircle, bg: colors.accentPrimaryBg, text: colors.accentPrimary };
      default:
        return { icon: AlertCircle, bg: colors.accentPrimaryBg, text: colors.accentPrimary };
    }
  };

  const AttentionCard = ({ item }: { item: AttentionItem }) => {
    const config = getIconConfig(item.type);
    const Icon = config.icon;

    return (
      <Card
        style={{
          ...cardStyles.default,
          marginBottom: spacing['3'],
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing['4'],
        }}
      >
        <div
          style={{
            ...getIconContainerStyle('default'),
            backgroundColor: config.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <Icon size={18} color={config.text} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            marginBottom: spacing['1'],
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
            marginBottom: spacing['3'],
            lineHeight: typography.lineHeight.tight,
          }}>
            {item.description}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'], flexWrap: 'wrap' }}>
            {item.cta && (
              <Button
                size="sm"
                onClick={() => {
                  item.cta?.onClick();
                  handleDismiss(item.id);
                }}
              >
                {item.cta.label}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(item.id)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={{ backgroundColor: colors.background }}>
      <PageHeader
        title="Notifications"
        subtitle="Things that need your attention"
      />

      {/* Content */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: spacing['9'],
          paddingBottom: spacing['12'],
        }}
      >
        {visibleItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            paddingTop: '80px',
            paddingBottom: '80px',
          }}>
            <AlertCircle
              size={48}
              color={colors.textTertiary}
              style={{ margin: '0 auto', marginBottom: spacing['4'] }}
            />
            <p style={{
              fontSize: typography.fontSize.lg,
              color: colors.textMuted,
              marginBottom: spacing['2'],
            }}>
              All caught up
            </p>
            <p style={{
              fontSize: typography.fontSize.base,
              color: colors.textTertiary,
            }}>
              Check back later for updates
            </p>
          </div>
        ) : (
          <div>
            {/* High Priority Section */}
            {highPriority.length > 0 && (
              <section style={{ marginBottom: spacing['12'] }}>
                <div style={{
                  fontSize: sectionHeaderStyles.fontSize,
                  fontWeight: sectionHeaderStyles.fontWeight,
                  letterSpacing: sectionHeaderStyles.letterSpacing,
                  textTransform: sectionHeaderStyles.textTransform,
                  color: sectionHeaderStyles.color,
                  marginBottom: sectionHeaderStyles.marginBottom,
                }}>
                  Action needed
                </div>
                <div>
                  {highPriority.map(item => (
                    <AttentionCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* Medium Priority Section */}
            {mediumPriority.length > 0 && (
              <section>
                <div style={{
                  fontSize: sectionHeaderStyles.fontSize,
                  fontWeight: sectionHeaderStyles.fontWeight,
                  letterSpacing: sectionHeaderStyles.letterSpacing,
                  textTransform: sectionHeaderStyles.textTransform,
                  color: sectionHeaderStyles.color,
                  marginBottom: sectionHeaderStyles.marginBottom,
                }}>
                  For your awareness
                </div>
                <div>
                  {mediumPriority.map(item => (
                    <AttentionCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
