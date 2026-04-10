"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "../page-header";
import { HouseholdCard } from "../household-card";
import { mockTrip, getHouseholdProgress, type Household } from "@/lib/mock-data";
import { PartyPopper } from "lucide-react";

interface GroupProgressViewProps {
  onHouseholdSelect?: (household: Household) => void;
}

export function GroupProgressView({ onHouseholdSelect }: GroupProgressViewProps) {
  // Sort households by completion (complete first, then by progress)
  const sortedHouseholds = [...mockTrip.households].sort((a, b) => {
    const progressA = getHouseholdProgress(a);
    const progressB = getHouseholdProgress(b);
    return progressB - progressA;
  });

  const completeHouseholds = sortedHouseholds.filter(
    h => getHouseholdProgress(h) === 100
  );
  const pendingHouseholds = sortedHouseholds.filter(
    h => getHouseholdProgress(h) < 100
  );

  return (
    <div>
      <PageHeader 
        title="Group Progress" 
        subtitle={`${mockTrip.households.length} households`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* All done empty state */}
        {pendingHouseholds.length === 0 && completeHouseholds.length > 0 && (
          <Card className="border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
              <PartyPopper className="h-7 w-7 text-emerald-700" />
            </div>
            <h3 className="font-semibold text-lg text-foreground">Everyone&apos;s ready!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              All households have completed their tasks.
            </p>
          </Card>
        )}

        {/* Pending households */}
        {pendingHouseholds.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg text-foreground mb-4">In Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {pendingHouseholds.map((household) => (
                <HouseholdCard 
                  key={household.id} 
                  household={household} 
                  onClick={() => onHouseholdSelect?.(household)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Complete households */}
        {completeHouseholds.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg text-foreground mb-4">All Done</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {completeHouseholds.map((household) => (
                <HouseholdCard 
                  key={household.id} 
                  household={household} 
                  showReminder={false}
                  onClick={() => onHouseholdSelect?.(household)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
