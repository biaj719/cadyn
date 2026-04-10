import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust if needed

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      const { data, error } = await supabase
        .from("trips")
        .select("id, name, destination, start_date, end_date")
        .eq("id", tripId)
        .single();

      if (!error) {
        setTrip(data);
      }

      setLoading(false);
    }

    loadTrip();
  }, [tripId]);

  return { trip, loading };
}