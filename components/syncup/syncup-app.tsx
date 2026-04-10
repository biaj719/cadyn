"use client";

import { useState, useCallback, useMemo } from "react";
import { AppShell } from "./app-shell";
import { CadynLogo } from "@/components/cadyn-logo";
import { TripsView } from "./views/trips-view";
import { TripOverviewView } from "./views/trip-overview-view";
import { MyPlanView } from "./views/my-plan-view";
import { GroupsView } from "./views/groups-view";
import { WalletView } from "./views/wallet-view";
import { ActivityView } from "./views/activity-view";
import { NotificationsView } from "./views/notifications-view";
import { BuildTripView } from "./views/build-trip-view";
import { HouseholdDetailView } from "./views/household-detail-view";
import { SharedDetailView } from "./views/shared-detail-view";
import { ManageProfilePanel } from "./panels/manage-profile-panel";
import { JoinCreateTripDialog } from "./join-create-trip-dialog";
import { getCurrentUserHousehold, mockTrip, mockActivityResponses, type Household, type Task } from "@/lib/mock-data";

type View = 
  | "trips" 
  | "trip-overview" 
  | "my-plan" 
  | "groups"
  | "wallet" 
  | "activity"
  | "notifications"
  | "build-trip"
  | "item-detail"
  | "household-detail"
  | "group-detail";

// State model for required tasks: status-based
type TaskStatus = "not-started" | "in-progress" | "completed";
type TaskStateMap = Record<string, TaskStatus>;

// State model for optional activities: response-based
type ActivityResponse = "no-response" | "going" | "not-going";
type ActivityStateMap = Record<string, ActivityResponse>;

// Activity feed for tracking user interactions
interface ActivityFeedItem {
  id: string;
  type: "activity-joined" | "task-completed" | "task-in-progress" | "activity-declined" | "item-added";
  message: string;
  timestamp: Date;
  read: boolean;
}

export function CadynApp() {
  const [currentView, setCurrentView] = useState<View>("trips");
  const [isOrganizer] = useState(true);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<"flights" | "hotel" | "insurance" | "activity" | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>("trips");
  
  // Panel state management
  const [isManageProfileOpen, setIsManageProfileOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isJoinCreateTripOpen, setIsJoinCreateTripOpen] = useState(false);
  
  // Separate state for required tasks and optional activities
  const [requiredTaskStates, setRequiredTaskStates] = useState<TaskStateMap>({});
  
  // Initialize activity responses with stable mock defaults
  const [activityResponses, setActivityResponses] = useState<ActivityStateMap>(() => {
    const defaults: ActivityStateMap = {};
    // Set Snorkeling Tour as "going" for The Johnsons (current user)
    defaults["j-snorkeling"] = "going";
    return defaults;
  });

  // Demo state for added activities (prototype mode)
  const [demoAddedActivities, setDemoAddedActivities] = useState<Array<{
    id: string;
    name: string;
    description: string;
    cost: string;
  }>>([]);

  // Activity feed for tracking interactions
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([
    {
      id: "initial",
      type: "activity-joined",
      message: "You joined the Snorkeling Tour",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  // Memoized navigation handlers to prevent unnecessary re-renders
  const handleSelectTrip = useCallback(() => {
    setCurrentView("trip-overview");
  }, []);

  const handleBackToTrips = useCallback(() => {
    setCurrentView("trips");
  }, []);

  const handleNavigate = useCallback((view: string) => {
    // Handle panel actions
    if (view === "trip-settings") {
      setCurrentView("build-trip");
      return;
    }
    if (view === "manage-profile") {
      setIsManageProfileOpen(true);
      return;
    }
    setCurrentView(view as View);
  }, []);

  const handleTaskSelect = useCallback((task: Task) => {
    // Convert task to item type for unified detail view
    if (["flights", "hotel", "insurance"].includes(task.category)) {
      setSelectedItemType(task.category as "flights" | "hotel" | "insurance");
      setPreviousView((prev) => {
        return currentView !== "item-detail" ? currentView : prev;
      });
      setCurrentView("item-detail");
    }
  }, [currentView]);

  const handleHouseholdSelect = useCallback((household: Household) => {
    setSelectedHousehold(household);
    setPreviousView((prev) => {
      return currentView !== "household-detail" ? currentView : prev;
    });
    setCurrentView("household-detail");
  }, [currentView]);

  const handleItemSelect = useCallback((itemType: "flights" | "hotel" | "insurance" | "activity") => {
    setSelectedItemType(itemType);
    setPreviousView((prev) => {
      return currentView !== "item-detail" ? currentView : prev;
    });
    setCurrentView("item-detail");
  }, [currentView]);

  const handleGroupSelect = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
    setPreviousView((prev) => {
      return currentView !== "group-detail" ? currentView : prev;
    });
    setCurrentView("group-detail");
  }, [currentView]);

  const handleConfigureTrip = useCallback(() => {
    setCurrentView("build-trip");
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setCurrentView(previousView);
    setSelectedHousehold(null);
    setSelectedItemType(null);
    setSelectedGroupId(null);
  }, [previousView]);

  // Required task state management with activity feed
  const updateRequiredTaskStatus = useCallback(
    (taskId: string, status: TaskStatus) => {
      const prevStatus = requiredTaskStates[taskId];
      setRequiredTaskStates((prev) => ({
        ...prev,
        [taskId]: status,
      }));

      // Add to activity feed
      let feedMessage = "";
      let feedType: ActivityFeedItem["type"] = "task-in-progress";
      if (status === "completed" && prevStatus !== "completed") {
        feedMessage = "You completed a required task";
        feedType = "task-completed";
      } else if (status === "in-progress" && prevStatus !== "in-progress") {
        feedMessage = "You started working on a task";
        feedType = "task-in-progress";
      } else if (status === "not-started" && prevStatus !== "not-started") {
        feedMessage = "You reset a task to not started";
        feedType = "task-in-progress";
      }

      if (feedMessage) {
        const newFeedItem: ActivityFeedItem = {
          id: `feed-${Date.now()}`,
          type: feedType,
          message: feedMessage,
          timestamp: new Date(),
          read: false,
        };
        setActivityFeed((prev) => [newFeedItem, ...prev]);
      }
    },
    [requiredTaskStates]
  );

  const getRequiredTaskStatus = useCallback(
    (task: Task): TaskStatus => {
      if (task.category === "other") return task.status as TaskStatus;
      return requiredTaskStates[task.id] ?? (task.status as TaskStatus);
    },
    [requiredTaskStates]
  );

  // Optional activity response management with activity feed
  const updateActivityResponse = useCallback(
    (activityId: string, response: ActivityResponse) => {
      const prevResponse = activityResponses[activityId];
      setActivityResponses((prev) => ({
        ...prev,
        [activityId]: response,
      }));

      // Add to activity feed
      let feedMessage = "";
      let feedType: ActivityFeedItem["type"] = "activity-joined";
      if (response === "going" && prevResponse !== "going") {
        feedMessage = "You joined an activity";
        feedType = "activity-joined";
      } else if (response === "not-going" && prevResponse !== "not-going") {
        feedMessage = "You declined an activity";
        feedType = "activity-declined";
      } else if (response === "no-response") {
        feedMessage = "You withdrew your activity response";
        feedType = "activity-declined";
      }

      if (feedMessage) {
        const newFeedItem: ActivityFeedItem = {
          id: `feed-${Date.now()}`,
          type: feedType,
          message: feedMessage,
          timestamp: new Date(),
          read: false,
        };
        setActivityFeed((prev) => [newFeedItem, ...prev]);
      }
    },
    [activityResponses]
  );

  const getActivityResponse = useCallback(
    (activityId: string): ActivityResponse => {
      return activityResponses[activityId] ?? "no-response";
    },
    [activityResponses]
  );

  // Compute a safe fallback view for detail pages missing required state
  // This prevents returning null and causing flashing
  const getSafeView = (): View => {
    if (currentView === "item-detail" && !selectedItemType) {
      return previousView;
    }
    if (currentView === "household-detail" && !selectedHousehold) {
      return previousView;
    }
    if (currentView === "group-detail" && !selectedGroupId) {
      return previousView;
    }
    return currentView;
  };

  const safeView = getSafeView();

  // Render the appropriate view based on safeView (not currentView)
  const renderView = () => {
    switch (safeView) {
      case "trips":
        return (
          <TripsView
            onSelectTrip={handleSelectTrip}
            onOpenJoinCreateDialog={() => setIsCreateTripOpen(true)}
          />
        );
      case "trip-overview":
        return <TripOverviewView
          onHouseholdSelect={handleHouseholdSelect}
          onItemSelect={handleItemSelect}
          getRequiredTaskStatus={getRequiredTaskStatus}
          getActivityResponse={getActivityResponse}
          updateActivityResponse={updateActivityResponse}
          onNavigate={handleNavigate}
          onBack={handleBackToTrips}
          onTaskSelect={handleTaskSelect}
        />;
      case "my-plan":
        return <MyPlanView 
          onTaskSelect={handleTaskSelect}
          getRequiredTaskStatus={getRequiredTaskStatus}
          getActivityResponse={getActivityResponse}
        />;
      case "groups":
        return <GroupsView 
          onItemSelect={handleItemSelect}
          onGroupSelect={handleGroupSelect}
          onConfigureTrip={handleConfigureTrip}
          isOrganizer={isOrganizer}
          getRequiredTaskStatus={getRequiredTaskStatus}
          getActivityResponse={getActivityResponse}
        />;
      case "wallet":
        return <WalletView />;
      case "activity":
        return (
          <ActivityView 
            onNavigateToItem={handleItemSelect}
            onNavigateToGroup={handleGroupSelect}
            onNavigateToWallet={() => setCurrentView("wallet")}
          />
        );
      case "notifications":
        return <NotificationsView 
          activityFeed={activityFeed}
          onMarkAsRead={(id) => {
            setActivityFeed(prev => 
              prev.map(item => item.id === id ? { ...item, read: true } : item)
            );
          }}
          onMarkAllAsRead={() => {
            setActivityFeed(prev => 
              prev.map(item => ({ ...item, read: true }))
            );
          }}
        />;
      case "build-trip":
        return (
          <BuildTripView 
            onBack={handleBackFromDetail}
            isOrganizer={isOrganizer}
          />
        );
      case "item-detail":
        return (
          <SharedDetailView
            itemType={selectedItemType}
            onBack={handleBackFromDetail}
            onNavigateToGroup={handleGroupSelect}
            requiredTaskStates={requiredTaskStates}
            updateRequiredTaskStatus={updateRequiredTaskStatus}
          />
        );
      case "household-detail":
        return (
          <HouseholdDetailView
            household={selectedHousehold}
            onBack={handleBackFromDetail}
            getActivityResponse={getActivityResponse}
            updateActivityResponse={updateActivityResponse}
          />
        );
      case "group-detail":
        return (
          <SharedDetailView
            itemType={selectedGroupId}
            onBack={handleBackFromDetail}
            onNavigateToGroup={handleGroupSelect}
            requiredTaskStates={requiredTaskStates}
            updateRequiredTaskStatus={updateRequiredTaskStatus}
          />
        );
      default:
        return <TripsView onSelectTrip={handleSelectTrip} />;
    }
  };

  // Trips list page - full responsive layout (no AppShell wrapper)
  if (safeView === "trips") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                type="button"
                onClick={() => setCurrentView("trips")}
                className="hover:opacity-80 transition-opacity"
              >
                <CadynLogo />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderView()}
        </main>

        {/* Create/Join Trip Dialog - Independent rendering on trips page */}
        <JoinCreateTripDialog
          open={isCreateTripOpen}
          onOpenChange={setIsCreateTripOpen}
        />
      </div>
    );
  }

  // Build Trip page - full-page without AppShell
  if (safeView === "build-trip") {
    return (
      <>
        {renderView()}
        
        {/* Join Trip Dialog - For in-trip pages */}
        <JoinCreateTripDialog
          open={isJoinCreateTripOpen}
          onOpenChange={setIsJoinCreateTripOpen}
        />
        
        {/* Action Panels */}
        <ManageProfilePanel
          isOpen={isManageProfileOpen}
          onClose={() => setIsManageProfileOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <AppShell 
        currentView={safeView} 
        onNavigate={handleNavigate}
        tripName={mockTrip.name}
      >
        {renderView()}
      </AppShell>
      
      {/* Join Trip Dialog - For in-trip pages */}
      <JoinCreateTripDialog
        open={isJoinCreateTripOpen}
        onOpenChange={setIsJoinCreateTripOpen}
      />
      
      {/* Action Panels */}
      <ManageProfilePanel
        isOpen={isManageProfileOpen}
        onClose={() => setIsManageProfileOpen(false)}
      />
    </>
  );
}
