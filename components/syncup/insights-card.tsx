import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows
} from "@/lib/design-tokens";

interface InsightItem {
  label: string;
  value: string | number;
  emphasis?: boolean;
}

interface InsightsCardProps {
  insights?: InsightItem[];
}

export function InsightsCard({ 
  insights = [
    { label: "3 trips this year", value: "2026" },
    { label: "20 shared experiences", value: "Across all trips" },
    { label: "Next trip in", value: "67 days" },
  ],
}: InsightsCardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius['2xl'],
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.sm,
        padding: spacing['8'],
        transition: 'all 0.2s ease',
      }}
      className="hover:border-textMuted/30"
    >
      {/* Header */}
      <h3
        style={{
          fontSize: typography.fontSize.lg,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.textMuted,
          marginBottom: spacing['6'],
        }}
      >
        Insights
      </h3>

      {/* Insights Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: spacing['6'],
        }}
      >
        {insights.map((insight, index) => (
          <div key={index}>
            <p
              style={{
                fontSize: typography.fontSize.base,
                color: colors.textMuted,
                marginBottom: spacing['2'],
                lineHeight: 1.4,
              }}
            >
              {insight.label}
            </p>
            <p
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: 700,
                color: insight.emphasis ? colors.accentPrimary : colors.textPrimary,
              }}
            >
              {insight.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
