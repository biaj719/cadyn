"use client";

import { useState } from "react";
import { PageHeader } from "../page-header";
import { mockTrip, getCurrentUserHousehold, mockActivityResponses, type Task } from "@/lib/mock-data";
import { colors, borderRadius, shadows, spacing, getProgressBarContainerStyle, getProgressBarFillStyle } from "@/lib/design-tokens";
import {
  Plane, BedDouble, Shield, Compass,
  CheckCircle2, Clock, Bell, MapPin, Calendar, Send, ChevronDown, ChevronUp,
} from "lucide-react";

type ItemType = "flights" | "hotel" | "insurance" | "activity";

interface DetailViewProps {
  itemId: string;
  itemType: ItemType;
  onBack: () => void;
  context?: "my-plan" | "groups";
  onUpdateRequiredTaskStatus?: (taskId: string, status: "not-started" | "in-progress" | "completed") => void;
  getRequiredTaskStatus?: (task: Task) => "not-started" | "in-progress" | "completed";
  onUpdateActivityResponse?: (activityId: string, response: "no-response" | "going" | "not-going") => void;
  getActivityResponse?: (activityId: string) => "no-response" | "going" | "not-going";
  onNavigateToGroup?: (groupId: string) => void;
}

const itemConfig = {
  flights:   { icon: Plane,     title: "Flights",          description: "Round-trip flights for all travelers",         notes: "Departing June 15 from LAX at 8:45 AM, returning June 22 at 6:30 PM.", type: "essential" as const },
  hotel:     { icon: BedDouble, title: "Hotel",            description: "Beachfront resort accommodation",              notes: "Beachfront Ocean Resort. Check-in June 15 after 3 PM, check-out June 22 before 11 AM.", type: "essential" as const },
  insurance: { icon: Shield,    title: "Travel Insurance", description: "Trip protection coverage for all travelers",   notes: "Covers trip cancellation, medical emergencies, and baggage. Deadline: May 15, 2026.", type: "essential" as const },
  activity:  { icon: Compass,   title: "Snorkeling Tour",  description: "Guided reef exploration activity",             notes: "Group discount available. Tour operates daily 9 AM - 2 PM. 4-hour tour with lunch.", type: "experience" as const },
};

const s = {
  card: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: borderRadius['2xl'], padding: '24px' } as React.CSSProperties,
  cardStrong: { background: colors.card, border: `1px solid #C8BFB5`, borderRadius: borderRadius['2xl'], padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' } as React.CSSProperties,
  label: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: colors.textMuted, marginBottom: '8px' },
  title: { fontSize: '18px', fontWeight: 700, color: colors.textPrimary, marginBottom: '4px' },
  body: { fontSize: '13px', color: colors.textSecondary, lineHeight: 1.5 },
  meta: { fontSize: '12px', color: colors.textMuted },
  badge: (color: 'green' | 'orange' | 'muted') => ({
    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '99px',
    background: color === 'green' ? '#E3EFE9' : color === 'orange' ? '#F6E7D8' : '#EFE9E0',
    color: color === 'green' ? '#2F6F5A' : color === 'orange' ? '#8B4F1A' : '#6F6A63',
  } as React.CSSProperties),
  btn: (variant: 'primary' | 'secondary' | 'ghost') => ({
    padding: variant === 'ghost' ? '8px 14px' : '10px 20px',
    borderRadius: '10px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', border: 'none',
    background: variant === 'primary' ? '#3D5C50' : variant === 'secondary' ? '#EAE4DC' : 'transparent',
    color: variant === 'primary' ? '#fff' : variant === 'ghost' ? colors.textMuted : '#2E2A26',
    ...(variant === 'secondary' ? { border: '1px solid #D8CFC5' } : {}),
  } as React.CSSProperties),
  iconWrap: (color: 'green' | 'muted') => ({
    width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    background: color === 'green' ? '#E3EFE9' : '#EFE9E0',
  } as React.CSSProperties),
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}` } as React.CSSProperties,
};

export function SharedDetailView({ itemId, itemType, onBack, context = "groups", onUpdateRequiredTaskStatus, getRequiredTaskStatus, onUpdateActivityResponse, getActivityResponse, onNavigateToGroup }: DetailViewProps) {
  const config = itemConfig[itemType];
  const Icon = config.icon;
  const isExperience = config.type === "experience";
  const userHousehold = getCurrentUserHousehold();
  const [groupsExpanded, setGroupsExpanded] = useState(true);

  const userTask = userHousehold.tasks.find(t => t.category === itemType);

  const currentStatus = userTask && !isExperience && getRequiredTaskStatus
    ? getRequiredTaskStatus(userTask)
    : !isExperience ? (userTask?.status as "not-started" | "in-progress" | "completed" || "not-started") : "not-started";

  const isComplete = !isExperience && currentStatus === "completed";
  const isInProgress = !isExperience && currentStatus === "in-progress";

  const currentResponse = isExperience && getActivityResponse
    ? getActivityResponse(userTask?.id || "")
    : "no-response";

  const groupData = mockTrip.households.map(household => {
    const isCurrentUser = household.id === userHousehold.id;
    if (isExperience) {
      const response = isCurrentUser ? currentResponse : (mockActivityResponses["snorkeling"]?.[household.id] ?? "no-response");
      return { name: household.name, response, isUser: isCurrentUser };
    }
    const task = household.tasks.find(t => t.category === itemType);
    return { name: household.name, response: task?.status || "not-started", isUser: isCurrentUser };
  });

  const completeCount = !isExperience ? groupData.filter(g => g.response === "completed").length : 0;
  const totalGroups = groupData.length;
  const progressPercent = !isExperience ? Math.round((completeCount / totalGroups) * 100) : 0;
  const goingCount = isExperience ? groupData.filter(g => g.response === "going").length : 0;
  const notGoingCount = isExperience ? groupData.filter(g => g.response === "not-going").length : 0;
  const noResponseCount = isExperience ? groupData.filter(g => g.response === "no-response").length : 0;

  return (
    <div>
      <PageHeader title={config.title} subtitle={config.description} onBack={onBack} />
      <div style={{ padding: '24px 32px 100px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* PRIMARY: Your Status / Your Response */}
          <div style={{ ...s.cardStrong, background: isComplete ? '#F4FAF7' : isExperience && currentResponse === 'going' ? '#F4FAF7' : colors.card, borderColor: isComplete || (isExperience && currentResponse === 'going') ? '#C8DDD4' : '#C8BFB5' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <div style={s.iconWrap(isComplete || (isExperience && currentResponse === 'going') ? 'green' : 'muted')}>
                <Icon size={20} color={isComplete || (isExperience && currentResponse === 'going') ? '#2F6F5A' : colors.textMuted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={s.title}>{isExperience ? "Your Response" : "Your Status"}</span>
                  {isExperience ? (
                    <span style={s.badge(currentResponse === 'going' ? 'green' : currentResponse === 'not-going' ? 'orange' : 'muted')}>
                      {currentResponse === 'going' ? 'Going' : currentResponse === 'not-going' ? 'Not going' : 'Not decided'}
                    </span>
                  ) : (
                    <span style={s.badge(isComplete ? 'green' : isInProgress ? 'orange' : 'muted')}>
                      {isComplete ? '✓ Booked' : isInProgress ? 'In progress' : 'Not started'}
                    </span>
                  )}
                </div>
                <p style={s.body}>
                  {isExperience
                    ? currentResponse === 'going' ? "You're going on this activity" : currentResponse === 'not-going' ? "You've opted out" : "Let us know if you're interested"
                    : isComplete ? `You've booked ${config.title.toLowerCase()}` : isInProgress ? `You're working on booking ${config.title.toLowerCase()}` : `You still need to book ${config.title.toLowerCase()}`
                  }
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
              {isExperience ? (
                <>
                  <button style={s.btn(currentResponse === 'going' ? 'primary' : 'secondary')}
                    onClick={() => onUpdateActivityResponse?.(userTask?.id || "", currentResponse === 'going' ? 'no-response' : 'going')}>
                    {currentResponse === 'going' ? "✓ I'm in" : "I'm in"}
                  </button>
                  <button style={s.btn(currentResponse === 'not-going' ? 'primary' : 'secondary')}
                    onClick={() => onUpdateActivityResponse?.(userTask?.id || "", currentResponse === 'not-going' ? 'no-response' : 'not-going')}>
                    {currentResponse === 'not-going' ? "✓ Not going" : "Not going"}
                  </button>
                </>
              ) : isComplete ? (
                <>
                  <button style={s.btn('secondary')} onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, 'in-progress')}>Edit</button>
                  <button style={{ ...s.btn('ghost'), color: '#8B4F1A' }} onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, 'not-started')}>Mark as not booked</button>
                </>
              ) : (
                <>
                  <button style={s.btn('primary')} onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, isInProgress ? 'completed' : 'in-progress')}>
                    {isInProgress ? 'Mark as done' : 'Get started'}
                  </button>
                  {!isInProgress && (
                    <button style={s.btn('secondary')} onClick={() => userTask && onUpdateRequiredTaskStatus?.(userTask.id, 'completed')}>
                      Already done
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* GROUP PROGRESS */}
          <div style={s.card}>
            <button type="button" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', marginBottom: groupsExpanded ? '16px' : 0 }}
              onClick={() => setGroupsExpanded(!groupsExpanded)}>
              <div>
                <div style={s.label}>{isExperience ? "Who's Going" : "Group Progress"}</div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary }}>
                  {isExperience
                    ? `${goingCount} going · ${notGoingCount} not going · ${noResponseCount} no response`
                    : `${completeCount} of ${totalGroups} households booked`}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {!isExperience && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '28px', fontWeight: 700, color: colors.textPrimary }}>{progressPercent}%</div>
                    <div style={s.meta}>Complete</div>
                  </div>
                )}
                {isExperience && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={s.badge('green')}>{goingCount} going</span>
                    <span style={s.badge('muted')}>{noResponseCount} pending</span>
                  </div>
                )}
                {groupsExpanded ? <ChevronUp size={16} color={colors.textMuted} /> : <ChevronDown size={16} color={colors.textMuted} />}
              </div>
            </button>

            {groupsExpanded && (
              <div>
                {!isExperience && (
                  <div style={{ ...getProgressBarContainerStyle(), marginBottom: '16px' }}>
                    <div style={getProgressBarFillStyle(progressPercent)} />
                  </div>
                )}
                {isExperience && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: '#E3EFE9', borderRadius: '10px', padding: '12px', textAlign: 'center' as const }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#2F6F5A' }}>{goingCount}</div>
                      <div style={s.meta}>Going</div>
                    </div>
                    <div style={{ background: '#F6E7D8', borderRadius: '10px', padding: '12px', textAlign: 'center' as const }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: '#8B4F1A' }}>{notGoingCount}</div>
                      <div style={s.meta}>Not going</div>
                    </div>
                    <div style={{ background: '#EFE9E0', borderRadius: '10px', padding: '12px', textAlign: 'center' as const }}>
                      <div style={{ fontSize: '24px', fontWeight: 700, color: colors.textMuted }}>{noResponseCount}</div>
                      <div style={s.meta}>No response</div>
                    </div>
                  </div>
                )}
                {isExperience && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={s.meta}>
                        {noResponseCount > 0 ? `${noResponseCount} group${noResponseCount !== 1 ? 's' : ''} haven't responded yet` : 'Everyone has responded'}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>
                        {Math.round(((goingCount + notGoingCount) / totalGroups) * 100)}% responded
                      </span>
                    </div>
                    <div style={getProgressBarContainerStyle()}>
                      <div style={getProgressBarFillStyle(Math.round(((goingCount + notGoingCount) / totalGroups) * 100))} />
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {groupData.map((group, i) => (
                    <div key={group.name} className="hover:bg-muted/20" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', background: i % 2 === 0 ? colors.background : 'transparent', cursor: 'pointer' }} onClick={() => onNavigateToGroup?.(group.name)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textPrimary }}>{group.name}</span>
                        {group.isUser && <span style={s.badge('green')}>You</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isExperience ? (
                          group.response === 'going' ? <span style={s.badge('green')}>Going</span>
                          : group.response === 'not-going' ? <span style={s.badge('orange')}>Not going</span>
                          : <span style={s.badge('muted')}>No response</span>
                        ) : (
                          group.response === 'completed' ? <span style={s.badge('green')}>✓ Booked</span>
                          : group.response === 'in-progress' ? <span style={s.badge('orange')}>In progress</span>
                          : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ ...s.meta }}>Not started</span>
                              <button style={{ ...s.btn('secondary'), padding: '5px 12px', fontSize: '11px' }}>
                                <Bell size={11} style={{ marginRight: '4px', display: 'inline' }} />
                                Remind
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div style={s.card}>
            <div style={{ ...s.label, marginBottom: '16px' }}>Details & Requirements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Calendar size={16} color={colors.textMuted} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: colors.textPrimary, marginBottom: '2px' }}>Dates</div>
                  <div style={s.meta}>June 15 – 22, 2026</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={16} color={colors.textMuted} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: colors.textPrimary, marginBottom: '2px' }}>Location</div>
                  <div style={s.meta}>Cabo San Lucas, Mexico</div>
                </div>
              </div>
              <div style={{ paddingTop: '12px', borderTop: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: colors.textPrimary, marginBottom: '6px' }}>Notes</div>
                <div style={s.meta}>{config.notes}</div>
              </div>
            </div>
          </div>

          {/* DISCUSSION */}
          <div style={s.card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ ...s.label, marginBottom: 0 }}>Discussion</div>
              <span style={{ ...s.badge('muted'), fontSize: '10px' }}>3 messages</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', paddingBottom: '20px', borderBottom: `1px solid ${colors.border}` }}>
              {[
                { name: 'Sarah Johnson', time: '2 hours ago', msg: "Does anyone want to book the snorkeling tour together? I found a group discount." },
                { name: 'Ana Martinez', time: '1 hour ago', msg: "Yes! How much is the discount? We're definitely interested." },
                { name: 'You', time: '30 min ago', msg: "Count us in! I'll send the booking link to everyone.", isUser: true },
              ].map(m => (
                <div key={m.name} style={{ background: m.isUser ? '#F0F7F4' : 'transparent', borderRadius: m.isUser ? '10px' : 0, padding: m.isUser ? '12px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: colors.textPrimary }}>{m.name}</span>
                    <span style={s.meta}>{m.time}</span>
                  </div>
                  <p style={s.body}>{m.msg}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="text" placeholder="Add a comment..." style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: colors.background, fontSize: '13px', color: colors.textPrimary, outline: 'none' }} />
              <button style={{ ...s.btn('secondary'), padding: '10px 12px' }}>
                <Send size={14} color={colors.textMuted} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}