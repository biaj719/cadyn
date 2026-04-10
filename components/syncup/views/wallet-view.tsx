"use client";

import { 
  getCurrentUserSavings, 
  getDaysUntilTrip, 
  mockTrip,
  mockTripCosts,
  type TripCostItem,
} from "@/lib/mock-data";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  statStyles,
  textRoles,
  getProgressBarContainerStyle,
  getProgressBarFillStyle,
} from "@/lib/design-tokens";
import { 
  PiggyBank, 
  Target, 
  Calendar, 
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Heart,
  Sparkles,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle, PageContent } from "../page-layout";

export function WalletView() {
  // All calculations as pure derived constants
  const savings = getCurrentUserSavings();
  const daysUntilTrip = getDaysUntilTrip(mockTrip.startDate);
  const weeksUntilTrip = Math.ceil(daysUntilTrip / 7);
  
  const progress = Math.round((savings.saved / savings.goal) * 100);
  const remaining = savings.goal - savings.saved;
  const weeklyPace = weeksUntilTrip > 0 ? Math.ceil(remaining / weeksUntilTrip) : 0;
  
  const isComplete = progress >= 100;
  const isOnTrack = savings.status === "on-track";
  
  // Filter arrays once
  const essentials = mockTripCosts.filter(item => item.category === "essential");
  const experiences = mockTripCosts.filter(item => item.category === "experience");
  const paidItems = mockTripCosts.filter(item => item.status === "paid");
  const estimateItems = mockTripCosts.filter(item => item.status === "estimate");
  
  const totalCost = mockTripCosts.reduce((sum, item) => sum + item.cost, 0);
  const paidCount = paidItems.length;
  const estimateCount = estimateItems.length;

  // Build insights as a pure constant
  const insights = [
    ...((!isComplete && estimateCount > 0) ? [{
      icon: BookOpen,
      text: "Some items are estimates — confirm prices when you book",
      type: "neutral" as const,
    }] : []),
    ...((isOnTrack && !isComplete) ? [{
      icon: TrendingUp,
      text: "You're ahead of your savings pace",
      type: "positive" as const,
    }] : []),
    ...((paidCount > 0) ? [{
      icon: CheckCircle2,
      text: `${paidCount} items locked in — great progress`,
      type: "positive" as const,
    }] : []),
  ];

  return (
    <div>
      <PageTitle
        icon={<PiggyBank size={22} color="#8A847C" />}
        title="Wallet"
        subtitle="Track, save, and pay for your trip"
      />
      <PageContent>
        {/* 1. Hero Funding Card - Tightened and anchored */}
        <div style={{
          backgroundColor: colors.card,
          borderRadius: borderRadius['2xl'],
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.sm,
          padding: '24px',
          marginBottom: spacing['6'],
          transition: 'all 0.2s ease',
        }}
        className="hover:border-textMuted/30"
        >
          {/* Hero Content - Tighter grid with closer columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: spacing['6'], marginBottom: spacing['6'] }}>
            {/* Main metric - Funded % */}
            <div>
              <p style={{ ...textRoles.label, marginBottom: spacing['1.5'] }}>Funding</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing['1.5'] }}>
                <p style={{ fontSize: typography.fontSize['5xl'], fontWeight: typography.fontWeight.bold, color: isComplete ? colors.success : colors.textPrimary, lineHeight: '1' }}>{progress}%</p>
              </div>
              <div style={{ marginTop: spacing['2'], ...getProgressBarContainerStyle() }}>
                <div 
                  className="transition-all"
                  style={getProgressBarFillStyle(progress)}
                />
              </div>
            </div>

            {/* Saved amount */}
            <div>
              <p style={{ ...textRoles.label, marginBottom: spacing['1.5'] }}>Saved</p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing['1'], lineHeight: '1' }}>
                ${savings.saved.toLocaleString()}
              </p>
              <p style={textRoles.meta}>of ${savings.goal.toLocaleString()}</p>
            </div>

            {/* Remaining amount */}
            <div>
              <p style={{ ...textRoles.label, marginBottom: spacing['1.5'] }}>Remaining</p>
              <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: isComplete ? colors.success : colors.warning, marginBottom: spacing['1'], lineHeight: '1' }}>
                ${Math.max(0, remaining).toLocaleString()}
              </p>
              <p style={textRoles.meta}>
                {isComplete ? "Funded!" : `${estimateCount} pending`}
              </p>
            </div>
          </div>

          {/* Timeline and target info - Compact layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: spacing['6'],
            paddingTop: spacing['4'],
            borderTop: `1px solid ${colors.border}`,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing['1.5'], marginBottom: spacing['1.5'] }}>
                <Calendar style={{ width: '14px', height: '14px', color: colors.textMuted, flexShrink: 0 }} />
                <p style={textRoles.label}>Weeks until</p>
              </div>
              <p style={textRoles.title}>{weeksUntilTrip}</p>
            </div>
            {!isComplete && remaining > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing['1.5'], marginBottom: spacing['1.5'] }}>
                  <Target style={{ width: '14px', height: '14px', color: colors.textMuted, flexShrink: 0 }} />
                  <p style={textRoles.label}>Weekly pace</p>
                </div>
                <p style={textRoles.title}>${weeklyPace}/week</p>
              </div>
            )}
          </div>

          {/* CTA Button - Right aligned, compact */}
          <div style={{ marginTop: spacing['4'] }}>
            <Button className="gap-2 h-10" size="sm">
              <PiggyBank className="h-3.5 w-3.5" />
              Add contribution
            </Button>
          </div>
        </div>

        {/* 2. Wallet Insights - Compact and consistent */}
        {insights.length > 0 && (
          <div style={{ marginBottom: spacing['6'] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing['1.5'], marginBottom: spacing['3'] }}>
              <TrendingUp size={14} style={{ color: colors.textMuted }} />
              <span style={textRoles.label}>Wallet Insights</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: spacing['3'] }}>
              {insights.slice(0, 3).map((insight, idx) => {
                const IconComponent = insight.icon;
                
                return (
                  <div key={idx} style={{
                    backgroundColor: colors.card,
                    borderRadius: borderRadius.lg,
                    border: `1px solid ${colors.border}`,
                    padding: spacing['3'],
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:border-textMuted/30"
                  >
                    <div style={{ display: 'flex', gap: spacing['2.5'] }}>
                      <IconComponent style={{ width: '14px', height: '14px', color: insight.type === "positive" ? colors.success : colors.textMuted, flexShrink: 0, marginTop: '2px' }} />
                      <p style={textRoles.body}>{insight.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Trip Costs Section */}
        <div style={{ marginBottom: spacing['6'] }}>
          <div style={{ marginBottom: spacing['4'] }}>
            <h2 style={{ ...textRoles.titleLarge, marginBottom: spacing['1'] }}>Trip Costs</h2>
            <p style={textRoles.body}>See what&apos;s included and what&apos;s estimated</p>
          </div>

          {/* Essentials */}
          <div style={{ marginBottom: spacing['6'] }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing['1.5'], marginBottom: spacing['3'] }}>
              <CheckSquare size={14} style={{ color: colors.textMuted }} />
              <span style={textRoles.label}>Essentials</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing['3'] }}>
              {essentials.map((item) => (
                <CostItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Experiences */}
          {experiences.length > 0 && (
            <div style={{ marginBottom: spacing['6'] }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing['1.5'], marginBottom: spacing['3'] }}>
                <Sparkles size={14} style={{ color: colors.textMuted }} />
                <span style={textRoles.label}>Experiences</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing['3'] }}>
                {experiences.map((item) => (
                  <CostItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* Cost Summary - Tightened and aligned */}
          <div style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius['2xl'],
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.sm,
            padding: '20px',
            marginTop: spacing['6'],
            transition: 'all 0.2s ease',
          }}>
            <h3 style={{ ...textRoles.label, marginBottom: spacing['4'] }}>Trip Cost Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: spacing['5'] }}>
              <div>
                <p style={{ ...textRoles.label, marginBottom: spacing['1.5'] }}>Total Cost</p>
                <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing['1'], lineHeight: '1' }}>
                  ${totalCost.toLocaleString()}
                </p>
                <p style={textRoles.meta}>All items</p>
              </div>
              <div>
                <p style={{ ...textRoles.label, marginBottom: spacing['1.5'] }}>Funded Amount</p>
                <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.success, marginBottom: spacing['1'], lineHeight: '1' }}>
                  ${savings.saved.toLocaleString()}
                </p>
                <p style={textRoles.meta}>{paidCount} locked in</p>
              </div>
              <div>
                <p style={{ ...textRoles.label, marginBottom: spacing['1.5'] }}>Remaining</p>
                <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: remaining <= 0 ? colors.success : colors.warning, marginBottom: spacing['1'], lineHeight: '1' }}>
                  ${Math.max(0, remaining).toLocaleString()}
                </p>
                <p style={textRoles.meta}>{estimateCount} pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Soft IOUs - Compact and aligned */}
        <div>
          <h2 style={{ ...textRoles.titleLarge, marginBottom: spacing['1'] }}>Soft IOUs</h2>
          <p style={{ ...textRoles.body, marginBottom: spacing['4'] }}>Who&apos;s covered what so far</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing['3'] }}>
            <IOUCard 
              name="The Chens"
              action="covered your hotel"
              details="They prepaid for your room while booking"
              amount={450}
            />
            <IOUCard 
              name="The Patels"
              action="covered your flights"
              details="They added you to their group booking"
              amount={520}
            />
          </div>
        </div>
      </PageContent>
    </div>
  );
}

// Cost Item Card Component - Consistent and tight
function CostItem({ item }: { item: TripCostItem }) {
  const isPaid = item.status === "paid";
  
  return (
    <div style={{
      backgroundColor: isPaid ? colors.successLighter : colors.card,
      borderRadius: borderRadius['2xl'],
      border: `1px solid ${isPaid ? colors.border : colors.border}`,
      boxShadow: shadows.sm,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: spacing['3'],
      transition: 'all 0.2s ease',
    }}
    className="hover:border-textMuted/30"
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing['2'], marginBottom: spacing['1.5'] }}>
          <div style={{ flex: 1 }}>
            <h4 style={textRoles.title}>{item.title}</h4>
          </div>
          {isPaid && (
            <span style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              padding: `${spacing['0.5']} ${spacing['2']}`,
              borderRadius: borderRadius.full,
              backgroundColor: colors.success,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Booked
            </span>
          )}
          {!isPaid && (
            <span style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              padding: `${spacing['0.5']} ${spacing['2']}`,
              borderRadius: borderRadius.full,
              backgroundColor: colors.warningLight,
              color: colors.warning,
              display: 'flex',
              alignItems: 'center',
              gap: spacing['0.75'],
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              <AlertCircle style={{ width: '11px', height: '11px' }} />
              Estimate
            </span>
          )}
        </div>
        {item.description && (
          <p style={textRoles.meta}>{item.description}</p>
        )}
      </div>
      
      <div style={{ paddingTop: spacing['2'], borderTop: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ ...textRoles.title, fontWeight: 700, color: isPaid ? colors.success : colors.textPrimary }}>
          ${item.cost.toLocaleString()}
        </p>
        {isPaid && (
          <p style={{ fontSize: typography.fontSize.xs, color: colors.success, fontWeight: typography.fontWeight.semibold }}>
            Locked in
          </p>
        )}
      </div>
    </div>
  );
}

// IOU Card Component - Consistent and tight
function IOUCard({ name, action, details, amount }: { name: string; action: string; details: string; amount: number }) {
  return (
    <div style={{
      backgroundColor: colors.card,
      borderRadius: borderRadius['2xl'],
      border: `1px solid ${colors.border}`,
      boxShadow: shadows.sm,
      padding: '16px',
      transition: 'all 0.2s ease',
    }}
    className="hover:border-textMuted/30"
    >
      <div style={{ display: 'flex', gap: spacing['2.5'], marginBottom: spacing['3'] }}>
        <Heart style={{ width: '16px', height: '16px', color: colors.success, flexShrink: 0, marginTop: '1px' }} />
        <div>
          <p style={{ ...textRoles.title, marginBottom: spacing['0.5'] }}>{name} {action}</p>
          <p style={textRoles.body}>{details}</p>
        </div>
      </div>
      
      <div style={{
        paddingTop: spacing['3'],
        borderTop: `1px solid ${colors.border}`,
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: spacing['2.5'],
        alignItems: 'center',
      }}>
        <p style={textRoles.body}>You owe: <span style={{ color: colors.warning }}>${amount}</span></p>
        <Button variant="outline" size="sm" className="h-8">Settle up</Button>
      </div>
    </div>
  );
}
