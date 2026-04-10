import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type TripRow = {
  id: string;
  name: string;
  destination: string | null;
  start_date: string | null;
  end_date: string | null;
};

type HouseholdRow = {
  id: string;
  name: string;
};

type TaskDefinitionRow = {
  id: string;
  title: string;
  category: string | null;
};

type HouseholdTaskRow = {
  id: string;
  household_id: string;
  task_definition_id: string;
  status: string;
  completed_at: string | null;
};

type HouseholdSavingsRow = {
  household_id: string;
  goal_amount: number | string | null;
  current_amount: number | string | null;
  weekly_target: number | string | null;
};

type OverviewData = {
  trip: TripRow;
  households: Array<{
    id: string;
    name: string;
    completedTasks: number;
    totalTasks: number;
    status: "complete" | "in_progress" | "not_started";
  }>;
  tasks: Array<{
    id: string;
    title: string;
    category: string | null;
    completedHouseholds: number;
    totalHouseholds: number;
  }>;
  savings: {
    totalGoal: number;
    totalSaved: number;
    householdsOnTrack: number;
    householdsBehind: number;
  };
};

function buildOverviewData({
  trip,
  households,
  taskDefinitions,
  householdTasks,
  savingsRows,
}: {
  trip: TripRow;
  households: HouseholdRow[];
  taskDefinitions: TaskDefinitionRow[];
  householdTasks: HouseholdTaskRow[];
  savingsRows: HouseholdSavingsRow[];
}): OverviewData {
  const totalTasks = taskDefinitions.length;

  const householdsWithProgress = households.map((household) => {
    const rows = householdTasks.filter(
      (row) => row.household_id === household.id
    );

    const completedTasks = rows.filter(
      (row) => row.status === "completed"
    ).length;

    let status: "complete" | "in_progress" | "not_started" = "not_started";

    if (totalTasks > 0 && completedTasks === totalTasks) {
      status = "complete";
    } else if (completedTasks > 0) {
      status = "in_progress";
    }

    return {
      id: household.id,
      name: household.name,
      completedTasks,
      totalTasks,
      status,
    };
  });

  const taskProgress = taskDefinitions.map((task) => {
    const rows = householdTasks.filter(
      (row) => row.task_definition_id === task.id
    );

    const completedHouseholds = rows.filter(
      (row) => row.status === "completed"
    ).length;

    return {
      id: task.id,
      title: task.title,
      category: task.category,
      completedHouseholds,
      totalHouseholds: households.length,
    };
  });

  const totalGoal = savingsRows.reduce(
    (sum, row) => sum + Number(row.goal_amount || 0),
    0
  );

  const totalSaved = savingsRows.reduce(
    (sum, row) => sum + Number(row.current_amount || 0),
    0
  );

  const householdsOnTrack = savingsRows.filter((row) => {
    const goal = Number(row.goal_amount || 0);
    const current = Number(row.current_amount || 0);

    if (goal <= 0) return false;

    return current / goal >= 0.5;
  }).length;

  const householdsBehind = Math.max(0, savingsRows.length - householdsOnTrack);

  return {
    trip,
    households: householdsWithProgress,
    tasks: taskProgress,
    savings: {
      totalGoal,
      totalSaved,
      householdsOnTrack,
      householdsBehind,
    },
  };
}

export function useOverviewData(tripId: string) {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);

        const { data: trip, error: tripError } = await supabase
          .from("trips")
          .select("id, name, destination, start_date, end_date")
          .eq("id", tripId)
          .single();

        if (tripError) throw tripError;

        const { data: households, error: householdsError } = await supabase
          .from("households")
          .select("id, name")
          .eq("trip_id", tripId)
          .order("created_at", { ascending: true });

        if (householdsError) throw householdsError;

        const { data: taskDefinitions, error: taskDefinitionsError } =
          await supabase
            .from("task_definitions")
            .select("id, title, category")
            .eq("trip_id", tripId)
            .order("created_at", { ascending: true });

        if (taskDefinitionsError) throw taskDefinitionsError;

        const householdIds = (households || []).map((h) => h.id);

        let householdTasks: HouseholdTaskRow[] = [];
        if (householdIds.length > 0) {
          const { data: householdTasksData, error: householdTasksError } =
            await supabase
              .from("household_tasks")
              .select("id, household_id, task_definition_id, status, completed_at")
              .in("household_id", householdIds);

          if (householdTasksError) throw householdTasksError;
          householdTasks = householdTasksData || [];
        }

        let savingsRows: HouseholdSavingsRow[] = [];
        const { data: householdSavingsData, error: householdSavingsError } =
          await supabase
            .from("household_savings")
            .select("household_id, goal_amount, current_amount, weekly_target")
            .eq("trip_id", tripId);

        if (householdSavingsError) {
          console.warn("household_savings query failed:", householdSavingsError.message);
        } else {
          savingsRows = householdSavingsData || [];
        }

        const overview = buildOverviewData({
          trip: trip as TripRow,
          households: (households || []) as HouseholdRow[],
          taskDefinitions: (taskDefinitions || []) as TaskDefinitionRow[],
          householdTasks,
          savingsRows,
        });

        if (isMounted) {
          setData(overview);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Failed to load overview");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (tripId) {
      loadOverview();
    } else {
      setLoading(false);
      setError("Missing trip id");
    }

    return () => {
      isMounted = false;
    };
  }, [tripId]);

  return { data, loading, error };
}