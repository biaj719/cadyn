export interface Task {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  dueDate?: string;
  category: "flights" | "hotel" | "insurance" | "other";
}

export interface Household {
  id: string;
  name: string;
  members: string[];
  avatar?: string;
  tasks: Task[];
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  households: Household[];
  isOrganizer?: boolean;
}

export interface Activity {
  id: string;
  type: "reminder" | "update" | "milestone" | "nudge";
  message: string;
  timestamp: string;
  householdName?: string;
}

export interface TripCostItem {
  id: string;
  title: string;
  cost: number;
  status: "paid" | "estimate";
  category: "essential" | "experience";
  description?: string;
}

export interface SavingsProgress {
  householdId: string;
  householdName: string;
  goal: number;
  saved: number;
  status: "on-track" | "behind" | "not-started";
}

// Mock data for Cabo Trip 2026
export const mockTrip: Trip = {
  id: "cabo-2026",
  name: "Cabo Trip 2026",
  destination: "Cabo San Lucas, Mexico",
  startDate: "2026-06-15",
  endDate: "2026-06-22",
  isOrganizer: false,
  households: [
    {
      id: "johnson",
      name: "The Johnsons",
      members: ["Mike", "Sarah"],
      tasks: [
        {
          id: "j-flights",
          title: "Book flights",
          description: "Round-trip flights to Cabo San Lucas",
          status: "completed",
          category: "flights",
        },
        {
          id: "j-hotel",
          title: "Book hotel",
          description: "Resort reservation for June 15-22",
          status: "completed",
          category: "hotel",
        },
        {
          id: "j-insurance",
          title: "Get travel insurance",
          description: "Trip protection coverage",
          status: "in-progress",
          category: "insurance",
        },
        {
          id: "j-snorkeling",
          title: "Snorkeling Tour",
          description: "Guided reef exploration - June 17",
          status: "completed",
          category: "other",
        },
      ],
    },
    {
      id: "martinez",
      name: "The Martinez Family",
      members: ["Carlos", "Ana", "Sofia"],
      tasks: [
        {
          id: "m-flights",
          title: "Book flights",
          description: "Round-trip flights to Cabo San Lucas",
          status: "completed",
          category: "flights",
        },
        {
          id: "m-hotel",
          title: "Book hotel",
          description: "Resort reservation for June 15-22",
          status: "in-progress",
          category: "hotel",
        },
        {
          id: "m-insurance",
          title: "Get travel insurance",
          description: "Trip protection coverage",
          status: "not-started",
          category: "insurance",
        },
        {
          id: "m-snorkeling",
          title: "Snorkeling Tour",
          description: "Guided reef exploration - June 17",
          status: "completed",
          category: "other",
        },
      ],
    },
    {
      id: "chen",
      name: "The Chens",
      members: ["David", "Lisa"],
      tasks: [
        {
          id: "c-flights",
          title: "Book flights",
          description: "Round-trip flights to Cabo San Lucas",
          status: "in-progress",
          category: "flights",
        },
        {
          id: "c-hotel",
          title: "Book hotel",
          description: "Resort reservation for June 15-22",
          status: "not-started",
          category: "hotel",
        },
        {
          id: "c-insurance",
          title: "Get travel insurance",
          description: "Trip protection coverage",
          status: "not-started",
          category: "insurance",
        },
        {
          id: "c-snorkeling",
          title: "Snorkeling Tour",
          description: "Guided reef exploration - June 17",
          status: "not-started",
          category: "other",
        },
      ],
    },
    {
      id: "patel",
      name: "The Patels",
      members: ["Raj", "Priya", "Arjun", "Maya"],
      tasks: [
        {
          id: "p-flights",
          title: "Book flights",
          description: "Round-trip flights to Cabo San Lucas",
          status: "completed",
          category: "flights",
        },
        {
          id: "p-hotel",
          title: "Book hotel",
          description: "Resort reservation for June 15-22",
          status: "completed",
          category: "hotel",
        },
        {
          id: "p-insurance",
          title: "Get travel insurance",
          description: "Trip protection coverage",
          status: "completed",
          category: "insurance",
        },
        {
          id: "p-snorkeling",
          title: "Snorkeling Tour",
          description: "Guided reef exploration - June 17",
          status: "not-started",
          category: "other",
        },
      ],
    },
  ],
};

// Mock savings data for each household
export const mockSavingsProgress: SavingsProgress[] = [
  {
    householdId: "johnson",
    householdName: "The Johnsons",
    goal: 1500,
    saved: 1200,
    status: "on-track",
  },
  {
    householdId: "martinez",
    householdName: "The Martinez Family",
    goal: 2000,
    saved: 800,
    status: "behind",
  },
  {
    householdId: "chen",
    householdName: "The Chens",
    goal: 1500,
    saved: 0,
    status: "not-started",
  },
  {
    householdId: "patel",
    householdName: "The Patels",
    goal: 2500,
    saved: 2500,
    status: "on-track",
  },
];

// Get current user's savings (The Johnsons)
export function getCurrentUserSavings(): SavingsProgress {
  return mockSavingsProgress[0];
}

// Get savings stats for organizer view
export function getSavingsStats() {
  const onTrack = mockSavingsProgress.filter(s => s.status === "on-track").length;
  const behind = mockSavingsProgress.filter(s => s.status === "behind").length;
  const notStarted = mockSavingsProgress.filter(s => s.status === "not-started").length;
  const totalGoal = mockSavingsProgress.reduce((sum, s) => sum + s.goal, 0);
  const totalSaved = mockSavingsProgress.reduce((sum, s) => sum + s.saved, 0);
  
  return {
    onTrack,
    behind,
    notStarted,
    total: mockSavingsProgress.length,
    totalGoal,
    totalSaved,
    progress: Math.round((totalSaved / totalGoal) * 100),
  };
}

// Trip costs breakdown
export const mockTripCosts: TripCostItem[] = [
  // Essentials
  {
    id: "flights",
    title: "Round-trip flights",
    cost: 1260,
    status: "paid",
    category: "essential",
    description: "Flight bookings for all travelers",
  },
  {
    id: "hotel",
    title: "Resort accommodation",
    cost: 1800,
    status: "estimate",
    category: "essential",
    description: "7 nights at beachfront resort",
  },
  {
    id: "insurance",
    title: "Travel insurance",
    cost: 180,
    status: "estimate",
    category: "essential",
    description: "Trip protection coverage",
  },
  // Experiences
  {
    id: "snorkeling",
    title: "Snorkeling tour",
    cost: 150,
    status: "estimate",
    category: "experience",
    description: "Guided reef exploration",
  },
  {
    id: "dinner",
    title: "Sunset dinner cruise",
    cost: 200,
    status: "estimate",
    category: "experience",
    description: "Evening cruise with dinner",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "milestone",
    message: "The Patels completed all their tasks",
    timestamp: "2 hours ago",
    householdName: "The Patels",
  },
  {
    id: "2",
    type: "update",
    message: "The Johnsons booked their hotel",
    timestamp: "Yesterday",
    householdName: "The Johnsons",
  },
  {
    id: "3",
    type: "reminder",
    message: "Travel insurance deadline is in 2 weeks",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    type: "nudge",
    message: "Gentle reminder sent to The Chens about flights",
    timestamp: "3 days ago",
    householdName: "The Chens",
  },
];

// Helper functions
export function getHouseholdProgress(household: Household): number {
  const completed = household.tasks.filter((t) => t.status === "completed").length;
  return Math.round((completed / household.tasks.length) * 100);
}

export function getTripProgress(trip: Trip): number {
  const allTasks = trip.households.flatMap((h) => h.tasks);
  const completed = allTasks.filter((t) => t.status === "completed").length;
  return Math.round((completed / allTasks.length) * 100);
}

// Get user's progress on required tasks only
export function getUserTaskProgress(): number {
  const user = getCurrentUserHousehold();
  const requiredTasks = user.tasks.filter((t) => ["flights", "hotel", "insurance"].includes(t.category));
  if (requiredTasks.length === 0) return 0;
  const completed = requiredTasks.filter((t) => t.status === "completed").length;
  return Math.round((completed / requiredTasks.length) * 100);
}

export function getTaskCounts(trip: Trip) {
  const allTasks = trip.households.flatMap((h) => h.tasks);
  return {
    completed: allTasks.filter((t) => t.status === "completed").length,
    inProgress: allTasks.filter((t) => t.status === "in-progress").length,
    notStarted: allTasks.filter((t) => t.status === "not-started").length,
    total: allTasks.length,
  };
}

export function getDaysUntilTrip(startDate: string): number {
  // Parse start date as UTC to avoid timezone hydration mismatches
  const [year, month, day] = startDate.split("-").map(Number);
  const start = Date.UTC(year, month - 1, day);
  
  // Get current date as UTC midnight for consistent comparison
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  
  const diff = start - todayUTC;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDateRange(startDate: string, endDate: string): string {
  // Parse dates as UTC and format with UTC timezone to avoid hydration mismatch
  const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
  
  const start = new Date(Date.UTC(startYear, startMonth - 1, startDay));
  const end = new Date(Date.UTC(endYear, endMonth - 1, endDay));
  
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", timeZone: "UTC" };
  const endOptions: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" };
  return `${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", endOptions)}`;
}

// Get current user's household (for attendee view)
export function getCurrentUserHousehold(): Household {
  return mockTrip.households[0]; // The Johnsons
}

// Mock activity responses - stable data for prototype
// Maps activity task ID to response for each household
export const mockActivityResponses: Record<string, Record<string, "no-response" | "going" | "not-going">> = {
  "snorkeling": {
    "johnson": "going",      // The Johnsons are going
    "martinez": "going",     // The Martinez Family is going
    "chen": "no-response",   // The Chens haven't responded
    "patel": "not-going",    // The Patels are not going
  },
};

// Get default activity response for a household
export function getDefaultActivityResponse(activityType: string, householdId: string): "no-response" | "going" | "not-going" {
  return mockActivityResponses[activityType]?.[householdId] ?? "no-response";
}

// Get all activities for a trip (across all households)
export function getTripActivities(trip: Trip): Task[] {
  const activities = new Map<string, Task>();
  
  trip.households.forEach(household => {
    household.tasks.forEach(task => {
      if (task.category === "other") {
        // Use task title as key to avoid duplicates
        activities.set(task.title, task);
      }
    });
  });
  
  return Array.from(activities.values());
}

// Get next incomplete task for current user
export function getNextTask(): Task | null {
  const userHousehold = getCurrentUserHousehold();
  const requiredTasks = userHousehold.tasks.filter(t => 
    ["flights", "hotel", "insurance"].includes(t.category)
  );
  
  // Find first incomplete required task
  const nextTask = requiredTasks.find(t => t.status !== "completed");
  return nextTask || null;
}

// Get items that need attention
export function getNeedsAttention(trip: Trip) {
  const items: { type: string; message: string; householdName?: string }[] = [];
  
  trip.households.forEach((h) => {
    const notStarted = h.tasks.filter((t) => t.status === "not-started");
    if (notStarted.length === h.tasks.length) {
      items.push({
        type: "urgent",
        message: `${h.name} hasn't started any tasks yet`,
        householdName: h.name,
      });
    } else if (notStarted.length > 0) {
      items.push({
        type: "attention",
        message: `${h.name} has ${notStarted.length} task${notStarted.length > 1 ? "s" : ""} not started`,
        householdName: h.name,
      });
    }
  });
  
  return items;
}
