"use client";

import { useState } from "react";
import { PageTitle, PageContent } from "../page-layout";
import { mockTrip, getTaskCounts, type Task } from "@/lib/mock-data";
import { textRoles } from "@/lib/design-tokens";
import { 
  AlertCircle, 
  Clock, 
  Zap, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Bell,
  ChevronRight,
  Users,
  Star,
  BarChart2
} from "lucide-react";

interface GroupsViewProps {
  onItemSelect?: (itemType: "flights" | "hotel" | "insurance" | "activity") => void;
  onGroupSelect?: (groupId: string) => void;
  onConfigureTrip?: () => void;
  isOrganizer?: boolean;
  getRequiredTaskStatus?: (task: Task) => "not-started" | "in-progress" | "completed";
  getActivityResponse?: (activityId: string) => "no-response" | "going" | "not-going";
}

export function GroupsView({ onItemSelect, onGroupSelect, onConfigureTrip, isOrganizer, getRequiredTaskStatus, getActivityResponse }: GroupsViewProps) {
  const taskCounts = getTaskCounts(mockTrip);
  const groups = mockTrip.households;
  const [remindedItems, setRemindedItems] = useState<Set<string>>(new Set());
  const [remindedGroups, setRemindedGroups] = useState<Set<string>>(new Set());

  // Trip readiness alerts - high-signal items only
  const readinessAlerts = [
    {
      icon: AlertCircle,
      text: "1 group hasn't booked flights",
      color: "text-amber-600",
      priority: "high",
    },
    {
      icon: Clock,
      text: "2 groups still need travel insurance",
      color: "text-amber-600",
      priority: "high",
    },
    {
      icon: Zap,
      text: "Early bird rate expires in 2 days",
      color: "text-orange-600",
      priority: "medium",
    },
  ];

  // Shared bookings/requirements with discussion counts
  const sharedPlan: Array<{
    title: string;
    itemType: "flights" | "hotel" | "insurance";
    category: string;
    groupsComplete: number;
    groupsTotal: number;
    discussionCount: number;
    groups: Array<{ name: string; complete: boolean }>;
  }> = [
      {
        title: "Flights",
        itemType: "flights",
        category: "essential",
        groupsComplete: 3,
        groupsTotal: 4,
        discussionCount: 5,
        groups: [
          { name: "The Chens", complete: true },
          { name: "The Johnsons", complete: true },
          { name: "The Patels", complete: true },
          { name: "Friends Group", complete: false },
        ],
      },
      {
        title: "Hotel",
        itemType: "hotel",
        category: "essential",
        groupsComplete: 2,
        groupsTotal: 4,
        discussionCount: 3,
        groups: [
          { name: "The Chens", complete: true },
          { name: "The Johnsons", complete: false },
          { name: "The Patels", complete: true },
          { name: "Friends Group", complete: false },
        ],
      },
      {
        title: "Travel Insurance",
        itemType: "insurance",
        category: "essential",
        groupsComplete: 1,
        groupsTotal: 4,
        discussionCount: 2,
        groups: [
          { name: "The Chens", complete: true },
          { name: "The Johnsons", complete: false },
          { name: "The Patels", complete: false },
          { name: "Friends Group", complete: false },
        ],
      },
    ];

  // Optional activities
  const optionalActivities = [
    {
      title: "Snorkeling tour",
      groupsCommitted: 2,
      groupsTotal: 4,
      groups: [
        { name: "The Chens", committed: true },
        { name: "The Johnsons", committed: false },
        { name: "The Patels", committed: true },
        { name: "Friends Group", committed: false },
      ],
    },
    {
      title: "Sunset dinner cruise",
      groupsCommitted: 1,
      groupsTotal: 4,
      groups: [
        { name: "The Chens", committed: false },
        { name: "The Johnsons", committed: true },
        { name: "The Patels", committed: false },
        { name: "Friends Group", committed: false },
      ],
    },
  ];

  const handleRemindItem = (itemTitle: string) => {
    setRemindedItems(prev => new Set(prev).add(itemTitle));
  };

  const handleRemindGroup = (groupId: string) => {
    setRemindedGroups(prev => new Set(prev).add(groupId));
  };

  return (
    <div>
      <PageTitle
        icon={<Users size={22} color="#8A847C" />}
        title="Groups"
        subtitle="Track and coordinate your trip"
      />
      <PageContent>
        {/* 1. TRIP READINESS - HIGH-SIGNAL ALERTS (Compact, scannable) */}
        <section style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...textRoles.label, marginBottom: '8px' }}>
            <AlertCircle size={14} color="#8E8E93" />
            <span>Needs attention</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {readinessAlerts.map((alert, i) => {
              const Icon = alert.icon;
              return (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      background: '#FFFFFF',
                      border: '1px solid #EDE8E0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                    }}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${alert.color}`} />
                  <p style={textRoles.body}>{alert.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. SHARED PLAN - PRIMARY FOCUS (Most prominent section) */}
        <section className="border-t border-border/50 pt-6" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...textRoles.label, marginBottom: '8px' }}>
            <Users size={14} color="#8E8E93" />
            <span>Booking plan</span>
          </div>
          <div style={{ background: '#EDEAE3', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sharedPlan.map((item, i) => {
              const incompleteGroups = item.groups.filter(g => !g.complete);
              const isReminded = remindedItems.has(item.title);
              return (
                <div 
                  key={i} 
                  style={{ 
                    background: '#FFFFFF', 
                    borderRadius: '16px', 
                    border: '1px solid #EDE8E0', 
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => onItemSelect?.(item.itemType)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.95';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 style={textRoles.title}>{item.title}</h3>
                        <ChevronRight size={16} color="#C7C7CC" style={{ flexShrink: 0 }} />
                      </div>
                      <p style={{
                        ...textRoles.body,
                        fontWeight: 500,
                        marginTop: '4px',
                        whiteSpace: 'nowrap',
                        color: item.groupsComplete >= 3 ? '#2F6F5A' : item.groupsComplete === 2 ? '#FF9500' : '#FF3B30'
                      }}>
                        {item.groupsComplete} of {item.groupsTotal} groups complete
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {item.discussionCount > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                          <MessageCircle className="h-3.5 w-3.5" />
                          {item.discussionCount}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress bar - larger and more prominent */}
                  <div style={{ height: '6px', borderRadius: '100px', backgroundColor: '#E8E2D9', overflow: 'hidden', marginBottom: '16px' }}>
                    <div
                      style={{ height: '100%', backgroundColor: '#2F6F5A', transition: 'all', width: `${Math.round((item.groupsComplete / item.groupsTotal) * 100)}%` }}
                    />
                  </div>

                  {/* Group status chips - large and clear */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.groups.map((group) => (
                      <div
                        key={group.name}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          ...textRoles.body,
                          fontWeight: 500,
                          backgroundColor: group.complete ? '#EEF4F1' : '#F5F5F0',
                          color: group.complete ? '#2F6F5A' : '#9E9E9E'
                        }}
                      >
                        {group.complete ? (
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            {group.name}
                          </span>
                        ) : (
                          group.name
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Micro-actions: Remind for incomplete groups */}
                  {incompleteGroups.length > 0 && (
                    <div className="flex items-center gap-2">
                      {isReminded ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 px-3 py-1.5 rounded-lg bg-emerald-50">
                          <Check className="h-3.5 w-3.5" />
                          Reminder sent
                        </div>
                      ) : (
                        <button
                          type="button"
                          style={{ color: '#2F6F5A', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0 }}
                          onClick={() => handleRemindItem(item.title)}
                        >
                          <Bell className="h-3.5 w-3.5" />
                          Remind {incompleteGroups.length} group{incompleteGroups.length > 1 ? 's' : ''}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. OPTIONAL ACTIVITIES - Secondary but visible */}
        {optionalActivities.length > 0 && (
          <section className="border-t border-border/50 pt-6" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...textRoles.label, marginBottom: '8px' }}>
              <Star size={14} color="#8E8E93" />
              <span>Experiences</span>
            </div>
            <div className="space-y-3">
              {optionalActivities.map((activity, i) => {
                return (
                  <div
                    key={i}
                    style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EDE8E0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onClick={() => onItemSelect?.("activity")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '0.95';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 style={textRoles.title}>{activity.title}</h3>
                          <ChevronRight size={16} color="#C7C7CC" style={{ flexShrink: 0 }} />
                        </div>
                        <p style={{ ...textRoles.meta, marginTop: '4px' }}>
                          {activity.groupsCommitted} of {activity.groupsTotal} groups committed
                        </p>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>
        </section>
        )}

        {/* 4. GROUP STATUS - DIAGNOSTIC LAYER (Lighter emphasis, lower prominence) */}
        <section className="border-t border-border/50 pt-6" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...textRoles.label, marginBottom: '8px' }}>
            <BarChart2 size={14} color="#8E8E93" />
            <span>Group readiness</span>
          </div>
          <div style={{ background: '#EDEAE3', borderRadius: '16px', padding: '12px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EDE8E0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
            <div>
              {groups.map((group, groupIndex) => {
              const completedCount = group.tasks.filter(t => t.status === "completed").length;
              const totalCount = group.tasks.length;
              const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              // Show only incomplete/missing items for clarity
              const pending = group.tasks.filter(t => t.status !== "completed");
              const missingItems = pending.length > 0
                ? pending.slice(0, 2).map(t => {
                  if (t.category === "flights") return "Flights";
                  if (t.category === "hotel") return "Hotel";
                  if (t.category === "insurance") return "Insurance";
                  return t.title;
                })
                : [];

              const isComplete = progress === 100;
              const isReminded = remindedGroups.has(group.id);

              return (
                <div key={group.id}>
                  {groupIndex > 0 && <div style={{ height: '1px', backgroundColor: '#EDE8E0' }} />}
                  <div
                    style={{ padding: '12px 0', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '6px' }}
                    onClick={() => onGroupSelect?.(group.id)}
                  >
                    {/* Name and percentage row */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p style={textRoles.title}>{group.name}</p>
                        {missingItems.length > 0 && (
                          <p style={{ ...textRoles.meta, marginTop: '4px' }}>
                            Missing: {missingItems.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p style={textRoles.title}>{progress}%</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {totalCount > 0 && (
                      <div style={{ height: '6px', borderRadius: '100px', backgroundColor: '#E8E2D9', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: isComplete ? '#2F6F5A' : '#2F6F5A',
                            transition: 'all',
                            width: `${progress}%`
                          }}
                        />
                      </div>
                    )}

                    {/* Remind button directly under progress bar */}
                    {!isComplete && missingItems.length > 0 && (
                      <div>
                        {isReminded ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 px-3 py-1.5">
                            <Check className="h-3 w-3" />
                            Reminder sent
                          </div>
                        ) : (
                          <button
                            type="button"
                            style={{ color: '#2F6F5A', fontSize: '13px', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemindGroup(group.id);
                            }}
                          >
                            <Bell className="h-3 w-3" />
                            Remind
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
            </div>
          </div>
        </section>
      </PageContent>
    </div>
  );
}
