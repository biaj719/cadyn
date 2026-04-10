import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows
} from "@/lib/design-tokens";
import { MapPin } from "lucide-react";

interface GlobalTravelCardProps {
  totalTrips?: number;
  totalExperiences?: number;
  upcomingCount?: number;
  nextTripDaysAway?: number;
}

export function GlobalTravelCard({ 
  totalTrips = 3,
  totalExperiences = 20,
  upcomingCount = 1,
  nextTripDaysAway = 67,
}: GlobalTravelCardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius['2xl'],
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.sm,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        padding: spacing['10'],
      }}
      className="hover:border-textMuted/30"
    >
      {/* Subtle geographic background texture - abstract and premium */}
      <svg
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          opacity: 0.04,
          width: '400px',
          height: '400px',
        }}
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="geo-pattern" patternUnits="userSpaceOnUse" width="80" height="80">
            <path
              d="M0,40 Q20,30 40,40 T80,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <path
              d="M20,0 L60,80"
              stroke="currentColor"
              strokeWidth="0.3"
              opacity="0.6"
            />
            <circle cx="40" cy="40" r="3" fill="currentColor" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#geo-pattern)" stroke={colors.success} />
      </svg>

      {/* Subtle satellite gradient glow */}
      <div
        style={{
          position: 'absolute',
          right: -100,
          top: -100,
          width: '300px',
          height: '300px',
          borderRadius: borderRadius.circle,
          background: `radial-gradient(circle, ${colors.heroGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header with location icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'], marginBottom: spacing['8'] }}>
          <MapPin size={16} color={colors.textSecondary} />
          <span
            style={{
              fontSize: typography.fontSize.sm,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            }}
          >
            Your Travel Life
          </span>
        </div>

        {/* Main stats - editorial and calm */}
        <div style={{ marginBottom: spacing['8'] }}>
          <h2
            style={{
              fontSize: typography.fontSize['5xl'],
              fontWeight: 700,
              color: colors.textPrimary,
              lineHeight: 1.1,
              marginBottom: spacing['3'],
            }}
          >
            {totalTrips} Trips
          </h2>
          <p
            style={{
              fontSize: typography.fontSize.lg,
              color: colors.textMuted,
              lineHeight: 1.5,
            }}
          >
            {totalExperiences} shared experiences
          </p>
        </div>

        {/* Secondary info - upcoming */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing['4'],
            paddingTop: spacing['6'],
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          <div>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted }}>
              {upcomingCount} upcoming
            </p>
          </div>
          <div style={{ fontSize: typography.fontSize.sm, color: colors.textMuted }}>•</div>
          <div>
            <p style={{ fontSize: typography.fontSize.sm, color: colors.textMuted }}>
              Next trip in {nextTripDaysAway} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
