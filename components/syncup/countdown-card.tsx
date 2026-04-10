import { formatDateRange, getDaysUntilTrip } from "@/lib/mock-data";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows, 
  heroCardStyles 
} from "@/lib/design-tokens";
import { MapPin, Calendar } from "lucide-react";

interface CountdownCardProps {
  destination: string;
  startDate: string;
  endDate: string;
}

export function CountdownCard({ destination, startDate, endDate }: CountdownCardProps) {
  const daysLeft = getDaysUntilTrip(startDate);
  const dateRange = formatDateRange(startDate, endDate);

  return (
    <div style={{ 
      background: heroCardStyles.background, 
      borderRadius: borderRadius['2xl'],
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.sm, 
      position: 'relative', 
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
    className="hover:border-textMuted/30"
    >
      {/* Subtle geographic texture background - no literal illustrations */}
      <svg
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          opacity: 0.03,
          width: '300px',
          height: '300px',
        }}
        viewBox="0 0 300 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="subtle-geo" patternUnits="userSpaceOnUse" width="60" height="60">
            <path
              d="M0,30 Q15,20 30,30 T60,30"
              fill="none"
              stroke={colors.success}
              strokeWidth="0.5"
            />
            <path
              d="M15,0 L45,60"
              stroke={colors.success}
              strokeWidth="0.3"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="300" height="300" fill="url(#subtle-geo)" />
      </svg>

      {/* Subtle glow - abstract, not literal */}
      <div style={{ 
        position: 'absolute', 
        right: -80, 
        top: -80, 
        height: '200px', 
        width: '200px', 
        transform: 'translate(48px, -48px)', 
        borderRadius: borderRadius.circle, 
        backgroundColor: colors.heroGlow, 
        filter: 'blur(48px)' 
      }} />
      
      <div style={{ position: 'relative', padding: heroCardStyles.padding }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
              <MapPin className="h-4 w-4" />
              <span style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.medium }}>{destination}</span>
            </div>
            
            <div style={{ marginTop: spacing['4'], display: 'flex', alignItems: 'flex-end', gap: spacing['4'] }}>
              <span style={heroCardStyles.countdownNumber}>{daysLeft}</span>
              <span style={heroCardStyles.countdownLabel}>days to go</span>
            </div>

            <div className="mt-2 flex items-center gap-2" style={{ color: colors.textSecondary }}>
              <Calendar className="h-4 w-4" />
              <span style={{ fontSize: typography.fontSize.lg }}>{dateRange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
