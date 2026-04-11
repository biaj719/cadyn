"use client";

import { Button } from "@/components/ui/button";
import { PageTitle, PageContent } from "../page-layout";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  cardStyles,
  iconContainerStyles,
  taskCardStyles,
  textRoles,
  getBadgeStyle,
} from "@/lib/design-tokens";
import { 
  Check,
  Plane,
  Building2,
  Shield,
  Anchor,
  MessageCircle,
  ClipboardCheck,
  Sparkles,
  CheckSquare,
} from "lucide-react";

interface MyPlanViewProps {
  onTaskSelect?: (task: { id: string; category: string; title: string; description: string; status: string }) => void;
  getRequiredTaskStatus?: (task: any) => string;
  getActivityResponse?: (id: string) => string;
  onNavigate?: (view: string) => void;
}

export function MyPlanView({ onTaskSelect, getRequiredTaskStatus, getActivityResponse, onNavigate }: MyPlanViewProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flights":
        return <Plane className="h-5 w-5 text-foreground" />;
      case "hotel":
        return <Building2 className="h-5 w-5 text-foreground" />;
      case "insurance":
        return <Shield className="h-5 w-5 text-foreground" />;
      case "activity":
        return <Anchor className="h-5 w-5 text-foreground" />;
      default:
        return <Check className="h-5 w-5 text-foreground" />;
    }
  };

  // Static mock data for UI prototype
  const nextStep = {
    title: "Get travel insurance",
    category: "insurance",
    description: "Trip protection coverage",
  };

  const requiredTasks = [
    {
      id: "insurance",
      title: "Get travel insurance",
      category: "insurance",
      description: "Trip protection coverage · Jun 15–22",
      status: "in-progress",
      messages: 2,
    },
    {
      id: "flights",
      title: "Book flights",
      category: "flights",
      description: "Round-trip · Cabo San Lucas",
      status: "done",
      messages: 3,
    },
    {
      id: "hotel",
      title: "Book hotel",
      category: "hotel",
      description: "Resort · Jun 15–22",
      status: "done",
      messages: 1,
    },
  ];

  const pendingTasks = requiredTasks.filter(t => t.status !== "done");
  const completedTasks = requiredTasks.filter(t => t.status === "done");

  const getProgressMessage = (pending: number, total: number) => {
    if (pending === 0) return "All essentials complete";
    if (pending === 1) return "1 step left before booking is locked";
    if (pending / total <= 0.4) return "Almost ready to book";
    return `${pending} steps remaining`;
  };

  const commitments = [
    {
      id: "snorkeling",
      title: "Snorkeling Tour",
      category: "activity",
      description: "Guided reef exploration · Jun 17",
      going: true,
      messages: 1,
    },
  ];

  return (
    <div>
      <PageTitle
        icon={<CheckSquare size={22} color="#8A847C" />}
        title="My Plan"
        subtitle="Track your trip preparation"
      />
      <PageContent>
          
          {/* Your Next Step - PRIMARY CARD */}
          <div className="apple-card" style={{ padding: '24px', boxShadow: shadows.md, overflow: 'visible' }}>
            <div className="flex items-start gap-4">
              <div className="apple-icon-container" style={{ alignSelf: 'flex-start', marginTop: '4px', flexShrink: 0 }}>
                {getCategoryIcon(nextStep.category)}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ ...textRoles.label, marginBottom: spacing['4'] }}>Your Next Step</p>
                <h3 style={{ ...textRoles.title, marginBottom: spacing['4'] }}>{nextStep.title}</h3>
                <p style={{ ...textRoles.body, marginBottom: spacing['4'] }}>Trip protection coverage · Jun 15–22</p>
                <p style={{ ...textRoles.body, marginBottom: spacing['7'] }}>{getProgressMessage(pendingTasks.length, requiredTasks.length)}</p>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onTaskSelect?.({ 
                    id: "insurance", 
                    category: "insurance", 
                    title: "Get travel insurance",
                    description: "Trip protection coverage",
                    status: "in-progress"
                  })}
                >
                  Get quote
                </Button>
              </div>
            </div>
          </div>

          {/* Booking status */}
          <section style={{ marginBottom: '28px' }}>
            {/* Section header — outside the tint */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <ClipboardCheck size={14} color="#8E8E93" />
              <span style={{ ...textRoles.label }}>
                Required
              </span>
            </div>

            {/* Tinted wrapper — contains ALL cards */}
            <div style={{ background: '#EDEAE3', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {pendingTasks.map((task) => {
                const isInProgress = task.status === "in-progress";
                const isDone = task.status === "done";

                return (
                  <div
                    key={task.id}
                    className="cursor-pointer transition-colors hover:bg-opacity-70"
                    style={{
                      padding: '16px 16px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      backgroundColor: colors.card,
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onClick={() => onTaskSelect?.(task)}
                  >
                    {/* Row 1: Icon + Title + Status */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flexShrink: 0, marginTop: '4px', alignSelf: 'flex-start' }} className="apple-icon-container">
                        {getCategoryIcon(task.category)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{
                            ...textRoles.title,
                            flex: 1,
                            minWidth: 0
                          }}>
                            {task.title}
                          </span>
                          {isDone ? (
                            <div style={{ ...getBadgeStyle('done'), flexShrink: 0, alignSelf: 'center' }}>
                              <Check className="h-3 w-3" />
                              <span>Done</span>
                            </div>
                          ) : (
                            <span style={{ ...getBadgeStyle('progress'), flexShrink: 0, alignSelf: 'center', fontSize: '11px', padding: '3px 8px' }}>
                              In progress
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description Line */}
                    <div style={{
                      paddingLeft: taskCardStyles.description.paddingLeft,
                      marginTop: '6px',
                      marginBottom: '12px'
                    }}>
                      <span style={textRoles.body}>
                        {task.description}
                      </span>
                    </div>

                    {/* Message Indicator - Right-aligned Footer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '6px'
                    }}>
                      <MessageCircle size={12} color="#C7C7CC" />
                      <span style={{ ...textRoles.meta, marginLeft: '3px' }}>
                        {task.messages}
                      </span>
                    </div>
                  </div>
                );
              })}
              {completedTasks.length > 0 && (
                <>
                  <div style={{ height: '1px', background: colors.border, margin: '4px 0' }} />
                  {completedTasks.map((task) => {
                    const isDone = task.status === "done";

                    return (
                      <div key={task.id} style={{ opacity: 0.5 }}>
                        <div
                          className="cursor-pointer transition-colors hover:bg-opacity-70"
                          style={{
                            padding: '16px 16px',
                            border: `1px solid ${colors.border}`,
                            borderRadius: '12px',
                            backgroundColor: colors.card,
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                          onClick={() => onTaskSelect?.(task)}
                        >
                          {/* Row 1: Icon + Title + Status */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ flexShrink: 0, marginTop: '4px', alignSelf: 'flex-start' }} className="apple-icon-container">
                              {getCategoryIcon(task.category)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                <span style={{
                                  fontSize: '15px',
                                  fontWeight: 600,
                                  color: '#1A1A1A',
                                  lineHeight: 1.3,
                                  flex: 1,
                                  minWidth: 0
                                }}>
                                  {task.title}
                                </span>
                                {isDone ? (
                                  <div style={{ ...getBadgeStyle('done'), flexShrink: 0, alignSelf: 'center' }}>
                                    <Check className="h-3 w-3" />
                                    <span>Done</span>
                                  </div>
                                ) : (
                                  <span style={{ ...getBadgeStyle('progress'), flexShrink: 0, alignSelf: 'center', fontSize: '11px', padding: '3px 8px' }}>
                                    In progress
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Description Line */}
                          <div style={{
                            paddingLeft: taskCardStyles.description.paddingLeft,
                            marginTop: '6px',
                            marginBottom: '12px'
                          }}>
                            <span style={{
                              fontSize: '13px',
                              color: '#9E9E9E',
                              fontWeight: 400
                            }}>
                              {task.description}
                            </span>
                          </div>

                          {/* Message Indicator - Right-aligned Footer */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginTop: '6px'
                          }}>
                            <MessageCircle size={12} color="#C7C7CC" />
                            <span style={{ ...textRoles.meta, marginLeft: '3px' }}>
                              {task.messages}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </section>

          {/* Experiences */}
          <section style={{ marginBottom: '28px' }}>
            {/* Section header — outside the tint */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} color="#8E8E93" />
              <span style={{ ...textRoles.label }}>
                Optional
              </span>
            </div>

            {/* Tinted wrapper — contains ALL cards */}
            <div style={{ background: '#EDEAE3', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {commitments.map((commitment) => (
                <div
                  key={commitment.id}
                  className="cursor-pointer transition-colors hover:bg-opacity-70"
                  style={{ 
                    padding: '16px 16px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    backgroundColor: colors.card,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => onNavigate?.("activity")}
                >
                  {/* Row 1: Icon + Title + Status */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ flexShrink: 0, marginTop: '4px', alignSelf: 'flex-start' }} className="apple-icon-container">
                      {commitment.going ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <span style={{ fontSize: '18px', color: colors.textMutedLight }}>✕</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '15px', 
                          fontWeight: 600, 
                          color: '#1A1A1A', 
                          lineHeight: 1.3,
                          flex: 1,
                          minWidth: 0
                        }}>
                          {commitment.title}
                        </span>
                        <span style={{ ...getBadgeStyle(commitment.going ? 'done' : 'progress'), flexShrink: 0, alignSelf: 'center' }}>
                          {commitment.going ? "Going" : "Not going"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description Line */}
                  <div style={{ 
                    paddingLeft: taskCardStyles.description.paddingLeft, 
                    marginTop: '6px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '13px', 
                      color: '#9E9E9E',
                      fontWeight: 400
                    }}>
                      {commitment.description}
                    </span>
                  </div>

                  {/* Message Indicator - Right-aligned Footer */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    marginTop: '6px' 
                  }}>
                    <MessageCircle size={12} color="#C7C7CC" />
                    <span style={{ fontSize: '11px', color: '#C7C7CC', marginLeft: '3px' }}>
                      {commitment.messages}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </PageContent>
    </div>
  );
}
