import React from "react";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  cardStyles,
  iconContainerStyles,
  sectionHeaderStyles,
} from "@/lib/design-tokens";

/**
 * UNIVERSAL CARD COMPONENT SYSTEM
 * 
 * Standardized layout: [icon] [content] [meta]
 * - Icon: left-aligned, fixed width
 * - Content: flex-grow, text left-aligned
 * - Meta: right-aligned (messages, counts, etc.)
 */

interface UniversalCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  badges?: React.ReactNode[];
  messageCount?: number;
  onMessageClick?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  variant?: "primary" | "standard" | "compact";
  status?: "completed" | "in-progress" | "default";
  className?: string;
}

/**
 * PRIMARY CARD - For key actions like "Your Next Step"
 * Larger padding, prominent styling
 */
export function PrimaryCard({
  icon,
  title,
  description,
  badges,
  children,
  onClick,
  className,
  label,
}: UniversalCardProps & { children?: React.ReactNode; label?: string }) {
  return (
    <div
      style={{ 
        backgroundColor: colors.card, 
        borderRadius: borderRadius['2xl'],
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.sm, 
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onClick={onClick}
      className="hover:border-textMuted/30 hover:shadow-md"
    >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          backgroundColor: colors.iconContainerBg,
          borderRadius: borderRadius.lg,
          padding: '8px',
          flexShrink: 0,
          alignSelf: 'flex-start',
          marginTop: '4px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ transform: 'scale(1.1)' }}>
            {icon}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }} className="min-w-0">
          {label && (
            <p style={{ 
              fontSize: sectionHeaderStyles.fontSize, 
              fontWeight: sectionHeaderStyles.fontWeight, 
              letterSpacing: sectionHeaderStyles.letterSpacing, 
              textTransform: sectionHeaderStyles.textTransform, 
              color: sectionHeaderStyles.color,
              marginBottom: spacing['1']
            }}>
              {label}
            </p>
          )}
          <h3 style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing['3'] }}>
            {title}
          </h3>
          {description && (
            <p style={{ fontSize: typography.fontSize.xl, color: colors.textMuted, marginBottom: spacing['6'] }}>{description}</p>
          )}
          {badges && badges.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {badges}
            </div>
          )}
          {children && (
            <div style={{ width: 'fit-content', minWidth: '140px' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * STANDARD CARD - Default for tasks, activities, groups
 * Normal padding, standard styling
 */
export function StandardCard({
  icon,
  title,
  description,
  badges,
  messageCount,
  onMessageClick,
  onClick,
  status = "default",
  className,
}: UniversalCardProps) {
  const bgColor =
    status === "in-progress"
      ? "bg-primary/5 border-primary/30"
      : status === "completed"
      ? "bg-muted/5 hover:bg-muted/10"
      : "hover:bg-muted/30";

  return (
    <Card
      className={cn(
        "border-border/50 p-3 flex items-start gap-3 cursor-pointer transition-all",
        bgColor,
        className
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="rounded-lg p-2.5 flex-shrink-0 h-fit bg-muted">{icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-medium text-sm leading-tight",
          status === "completed" && "text-muted-foreground"
        )}>
          {title}
        </h4>

        {/* Badges below title */}
        {badges && badges.length > 0 && (
          <div className="flex items-center gap-2 mt-1">{badges}</div>
        )}

        {/* Description below badges */}
        {description && (
          <p className={cn(
            "text-xs mt-1 leading-snug",
            status === "completed" ? "text-muted-foreground/60" : "text-muted-foreground"
          )}>
            {description}
          </p>
        )}
      </div>

      {/* Message indicator right-aligned */}
      {messageCount !== undefined && messageCount > 0 && (
        <button
          className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded px-1.5 py-1 hover:bg-muted/30 ml-1 mt-0"
          onClick={(e) => {
            e.stopPropagation();
            onMessageClick?.(e);
          }}
          title={`${messageCount} message${messageCount !== 1 ? "s" : ""}`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="font-medium">{messageCount}</span>
        </button>
      )}
    </Card>
  );
}

/**
 * COMPACT ROW - For completed or low-priority items
 * Minimal padding, reduced visual weight
 */
export function CompactRow({
  icon,
  title,
  description,
  badges,
  messageCount,
  onMessageClick,
  onClick,
  className,
}: UniversalCardProps) {
  return (
    <Card
      className={cn(
        "border-border/50 p-2 flex items-start gap-3 cursor-pointer hover:bg-muted/10 transition-all",
        className
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <div className="rounded-lg p-2.5 flex-shrink-0 h-fit bg-muted">{icon}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm leading-tight text-muted-foreground">
          {title}
        </h4>

        {/* Badges below title */}
        {badges && badges.length > 0 && (
          <div className="flex items-center gap-2 mt-1">{badges}</div>
        )}

        {/* Description below badges */}
        {description && (
          <p className="text-xs mt-1 leading-snug text-muted-foreground/60">
            {description}
          </p>
        )}
      </div>

      {/* Message indicator right-aligned */}
      {messageCount !== undefined && messageCount > 0 && (
        <button
          className="flex-shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded px-1.5 py-1 hover:bg-muted/30 ml-1 mt-0"
          onClick={(e) => {
            e.stopPropagation();
            onMessageClick?.(e);
          }}
          title={`${messageCount} message${messageCount !== 1 ? "s" : ""}`}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span className="font-medium">{messageCount}</span>
        </button>
      )}
    </Card>
  );
}

/**
 * BADGE HELPER - Status badges as separate pills
 */
interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "primary" | "secondary";
  icon?: React.ReactNode;
}

export function StatusBadge({ label, variant = "default", icon }: BadgeProps) {
  const variantStyles = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-50 text-emerald-700",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
      variantStyles[variant]
    )}>
      {icon}
      {label}
    </span>
  );
}

/**
 * META TEXT - For additional info like household summary
 */
export function MetaText({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}
