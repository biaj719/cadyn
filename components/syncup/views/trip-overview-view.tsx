"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  mockTrip, 
  getCurrentUserHousehold, 
  getCurrentUserSavings,
  getTripProgress,
  getTaskCounts,
  getDaysUntilTrip,
  type Household,
  type Task,
} from "@/lib/mock-data";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  cardStyles,
  iconContainerStyles,
  statStyles,
  listRowStyles,
  progressBarStyles,
  getProgressBarContainerStyle,
  getProgressBarFillStyle,
  getIconContainerStyle,
  textRoles,
} from "@/lib/design-tokens";
import { PrimaryCard, StandardCard } from "../card-system";
import { CountdownCard } from "../countdown-card";
import { PageTitle, PageContent } from "../page-layout";
import { 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  PiggyBank,
  ChevronLeft,
  Settings,
  Users,
  TrendingUp,
  CheckCircle,
  Home,
} from "lucide-react";

interface TripOverviewViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
  onHouseholdSelect?: (household: Household) => void;
  onConfigureTrip?: () => void;
  isOrganizer?: boolean;
  getRequiredTaskStatus?: (task: Task) => "not-started" | "in-progress" | "completed";
  getActivityResponse?: (activityId: string) => "no-response" | "going" | "not-going";
}

export function TripOverviewView({ 
  onBack, 
  onNavigate, 
  onHouseholdSelect,
  onConfigureTrip,
  isOrganizer = false,
  getRequiredTaskStatus,
  getActivityResponse,
}: TripOverviewViewProps) {
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [daysUntilTrip, setDaysUntilTrip] = useState<number | null>(null);
  const [tripDuration, setTripDuration] = useState<number | null>(null);

  useEffect(() => {
    setDepartureDate(
      new Date(mockTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    );
    setDaysUntilTrip(getDaysUntilTrip(mockTrip.startDate));
    setTripDuration(
      Math.ceil((new Date(mockTrip.endDate).getTime() - new Date(mockTrip.startDate).getTime()) / (1000 * 60 * 60 * 24))
    );
  }, []);

  const userHousehold = getCurrentUserHousehold();
  const userSavings = getCurrentUserSavings();
  const tripProgress = getTripProgress(mockTrip);
  const taskCounts = getTaskCounts(mockTrip);
  
  const savingsProgress = Math.round((userSavings.saved / userSavings.goal) * 100);

  // Use shared state for task status
  const userTasks = userHousehold.tasks;
  const userCompletedTasks = userTasks.filter(t => {
    if (getRequiredTaskStatus && !["other"].includes(t.category)) {
      return getRequiredTaskStatus(t) === "completed";
    }
    return t.status === "completed";
  }).length;
  const userTotalTasks = userTasks.length;
  const userPendingTasks = userTasks.filter(t => {
    if (getRequiredTaskStatus && !["other"].includes(t.category)) {
      return getRequiredTaskStatus(t) !== "completed";
    }
    return t.status !== "completed";
  });
  
  const nextTask = userPendingTasks[0] || null;

  const progressRingValue = userTotalTasks > 0 ? Math.round((userCompletedTasks / userTotalTasks) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <PageTitle
        icon={<Home size={22} color="#8A847C" />}
        title={mockTrip.name}
        subtitle={mockTrip.destination}
      />

      <PageContent>
        <div className="space-y-8">
          {/* 1. CURRENT TRIP SECTION - Structured planning area starts here */}
          <div style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius['2xl'],
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.sm,
            padding: '24px',
            transition: 'all 0.2s ease',
          }}
          className="hover:border-textMuted/30"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing['2'], marginBottom: spacing['4'] }}>
              <span style={textRoles.label}>CURRENT TRIP</span>
            </div>
            <h2 style={{ ...textRoles.titleLarge, marginBottom: spacing['2'] }}>
              {mockTrip.name}
            </h2>
            <p style={{ ...textRoles.body, marginBottom: spacing['6'] }}>
              {mockTrip.destination}
            </p>

            {/* Trip countdown info */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing['6'],
              paddingTop: spacing['6'],
              borderTop: `1px solid ${colors.border}`,
            }}>
              <div>
                <p style={{ ...textRoles.label, marginBottom: spacing['1'] }}>
                  Departure
                </p>
                <p style={{ ...textRoles.title }}>
                  {departureDate ?? '—'}
                </p>
              </div>
              <div>
                <p style={{ ...textRoles.label, marginBottom: spacing['1'] }}>
                  Days remaining
                </p>
                <p style={{ ...textRoles.title }}>
                  {daysUntilTrip !== null ? daysUntilTrip : '—'} days
                </p>
              </div>
              <div>
                <p style={{ ...textRoles.label, marginBottom: spacing['1'] }}>
                  Duration
                </p>
                <p style={{ ...textRoles.title }}>
                  {tripDuration !== null ? tripDuration : '—'} days
                </p>
              </div>
            </div>
          </div>

          {/* 4. PLANNING SECTION - User's next step and progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content - next step and group progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Next Step */}
              {nextTask ? (
                <PrimaryCard
                  label="YOUR NEXT STEP"
                  icon={<Sparkles className="h-6 w-6 text-foreground" />}
                  title={nextTask.title}
                  description={nextTask.description}
                >
                  <div style={{ marginBottom: spacing['4'] }}>
                    <p style={{ ...textRoles.meta, marginBottom: spacing['2'] }}>
                      {taskCounts.completed} of {taskCounts.completed + taskCounts.inProgress + taskCounts.notStarted} groups have completed this — you&apos;re helping us stay on track.
                    </p>
                  </div>
                  <Button
                    className="bg-[#3D5C50] hover:bg-[#355649] text-white rounded-[14px] px-6 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)] font-medium text-sm inline-flex items-center gap-2"
                    onClick={() => onNavigate("my-plan")}
                  >
                    {nextTask.status === "in-progress" ? "Continue" : "Get Started"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </PrimaryCard>
              ) : (
                <Card style={{
                  ...cardStyles.default,
                  backgroundColor: colors.successLighter,
                  border: `1px solid ${colors.success}30`,
                }}>
                  <div className="flex items-start gap-4">
                    <div style={{
                      ...getIconContainerStyle('default'),
                      backgroundColor: colors.successLight,
                    }}>
                      <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 style={textRoles.titleLarge}>You&apos;re all set!</h3>
                      <p style={{ ...textRoles.body, marginTop: spacing['2'] }}>
                        All your tasks are complete. Enjoy the trip!
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Group Progress */}
              <div style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius['2xl'],
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.sm,
                padding: '20px',
                transition: 'all 0.2s ease',
              }} 
              className="hover:border-textMuted/30"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: spacing['5'] }}>
                  <Users size={14} color="#8E8E93" />
                  <span style={textRoles.label}>GROUP STATUS</span>
                </div>
                <h3 style={{ ...textRoles.titleLarge, marginBottom: spacing['2'] }}>Trip Progress</h3>

                {/* Summary statement */}
                <p style={{ ...textRoles.body, marginBottom: spacing['6'] }}>
                  {tripProgress >= 75 ? "Great momentum — most bookings are complete." : tripProgress >= 50 ? "You're on track. Keep the momentum going." : "You're getting there — only a few tasks remain."}
                </p>

                <div style={{ ...getProgressBarContainerStyle(), marginBottom: spacing['8'] }}>
                  <div 
                    className="transition-all"
                    style={getProgressBarFillStyle(tripProgress)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p style={{ fontSize: '28px', fontWeight: 600, color: statStyles.colors.success, marginBottom: statStyles.large.marginBottom }}>{taskCounts.completed}</p>
                    <p style={textRoles.label}>Done</p>
                  </div>
                  <div className="text-center">
                    <p style={{ fontSize: '28px', fontWeight: 600, color: statStyles.colors.warning, marginBottom: statStyles.large.marginBottom }}>{taskCounts.inProgress}</p>
                    <p style={textRoles.label}>In Progress</p>
                  </div>
                  <div className="text-center">
                    <p style={{ fontSize: '28px', fontWeight: 600, color: statStyles.colors.muted, marginBottom: statStyles.large.marginBottom }}>{taskCounts.notStarted}</p>
                    <p style={textRoles.label}>Pending</p>
                  </div>
                </div>
              </div>

              {/* Group Snapshot */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: spacing['5'] }}>
                  <CheckCircle size={14} color="#8E8E93" />
                  <span style={textRoles.label}>WHO&apos;S READY</span>
                </div>
                <div style={{ 
                  backgroundColor: colors.card, 
                  borderRadius: borderRadius['2xl'], 
                  border: `1px solid ${colors.border}`,
                  boxShadow: shadows.sm,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
                className="hover:border-textMuted/30"
                >
                  {mockTrip.households.slice(0, 4).map((household, index) => {
                    const hhTasks = household.tasks;
                    const hhCompleted = hhTasks.filter(t => t.status === "completed").length;
                    const hhTotal = hhTasks.length;

                    // Determine status description
                    let statusText = "";
                    if (hhCompleted === hhTotal) {
                      statusText = "Fully ready";
                    } else if (hhCompleted > 0) {
                      statusText = "Making progress";
                    } else {
                      statusText = "Still need to book";
                    }

                    const completionRatio = hhTotal > 0 ? hhCompleted / hhTotal : 0;
                    const ratioColor =
                      hhCompleted === 0
                        ? '#C67C4E'
                        : completionRatio >= 0.75
                          ? '#2F6F5A'
                          : '#2E2A26';

                    const rowContent = (
                      <div
                        key={household.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: spacing['4'],
                          borderBottom: index < mockTrip.households.slice(0, 4).length - 1 ? `1px solid ${colors.border}` : 'none',
                          transition: 'all 0.15s ease',
                        }}
                        className="hover:bg-foreground/2 active:bg-foreground/4"
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{ ...textRoles.title, display: 'block', marginBottom: spacing['1'] }}>{household.name}</span>
                          <span style={textRoles.meta}>
                            {statusText}
                          </span>
                        </div>
                        <span style={{ fontSize: listRowStyles.value.fontSize, fontWeight: listRowStyles.value.fontWeight, color: ratioColor, flexShrink: 0 }}>
                          {hhCompleted}/{hhTotal}
                        </span>
                      </div>
                    );

                    // If organizer and can interact, wrap in clickable container
                    if (isOrganizer && onHouseholdSelect) {
                      return (
                        <button
                          key={household.id}
                          onClick={() => onHouseholdSelect(household)}
                          className="w-full text-left"
                        >
                          {rowContent}
                        </button>
                      );
                    }
                    return rowContent;
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Progress */}
              <div style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius['2xl'],
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.sm,
                padding: '20px',
                transition: 'all 0.2s ease',
              }}
              className="hover:border-textMuted/30"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: spacing['6'] }}>
                  <TrendingUp size={14} color="#8E8E93" />
                  <span style={textRoles.label}>YOUR PROGRESS</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p style={{ fontSize: '28px', fontWeight: 700, color: '#1F1F1F', marginBottom: spacing['1'] }}>
                      {userCompletedTasks} of {userTotalTasks}
                    </p>
                    <p style={textRoles.body}>
                      tasks complete
                    </p>
                    {userPendingTasks.length > 0 && (
                      <p style={{ ...textRoles.meta, marginTop: spacing['2'] }}>
                        {userPendingTasks.length} task{userPendingTasks.length !== 1 ? 's' : ''} left — you&apos;re almost there
                      </p>
                    )}
                  </div>

                  <div style={getProgressBarContainerStyle()}>
                    <div 
                      className="transition-all"
                      style={getProgressBarFillStyle(Math.round((userCompletedTasks / userTotalTasks) * 100))}
                    />
                  </div>

                  {userCompletedTasks === userTotalTasks && (
                    <p style={{ fontSize: typography.fontSize.sm, color: colors.success, fontWeight: typography.fontWeight.medium }}>
                      All set! Time to relax and enjoy.
                    </p>
                  )}
                </div>
              </div>

              {/* Your Savings */}
              <div style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius['2xl'],
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.sm,
                padding: '20px',
                transition: 'all 0.2s ease',
              }}
              className="hover:border-textMuted/30"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: spacing['6'] }}>
                  <PiggyBank size={14} color="#8E8E93" />
                  <span style={textRoles.label}>YOUR SAVINGS</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-end gap-3">
                    <div style={{ 
                      width: iconContainerStyles.small.width, 
                      height: iconContainerStyles.small.height, 
                      borderRadius: iconContainerStyles.small.borderRadius, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0, 
                      backgroundColor: savingsProgress >= 100 ? colors.successLighter : userSavings.status === "on-track" ? colors.successLighter : colors.warningLight 
                    }}>
                      <PiggyBank style={{ width: '14px', height: '14px' }} className={savingsProgress >= 100 ? "text-emerald-700" : userSavings.status === "on-track" ? "text-emerald-700" : "text-amber-700"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.semibold, color: colors.success }}>
                        {savingsProgress}% funded
                      </p>
                    </div>
                  </div>

                  {/* Remaining amount and status */}
                  <div style={{
                    backgroundColor: colors.background,
                    borderRadius: borderRadius.lg,
                    padding: spacing['3'],
                    marginBottom: spacing['2'],
                  }}>
                    <p style={{ ...textRoles.label, marginBottom: spacing['1'] }}>
                      Remaining to save
                    </p>
                    <p style={{ ...textRoles.title, marginBottom: spacing['2'] }}>
                      ${userSavings.goal - userSavings.saved}
                    </p>
                    <p style={{ ...textRoles.meta, color: userSavings.status === "on-track" ? colors.success : userSavings.status === "behind" ? colors.warning : colors.textMuted }}>
                      {savingsProgress >= 100 ? "Almost fully funded" : userSavings.status === "on-track" ? "On track to finish in 2 weeks" : "You're behind schedule"}
                    </p>
                  </div>
                  
                  <div style={getProgressBarContainerStyle()}>
                    <div 
                      className="transition-all"
                      style={getProgressBarFillStyle(Math.min(savingsProgress, 100))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
}
