"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManageProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageProfilePanel({ isOpen, onClose }: ManageProfilePanelProps) {
  const isMobile = useIsMobile();
  
  // Panel state for sub-actions
  const [activeSubPanel, setActiveSubPanel] = useState<string | null>(null);

  if (!isOpen) return null;

  // Grouped action rows with right chevrons
  const AccountSection = () => (
    <div className="space-y-3">
      <ActionRow
        title="Edit name"
        subtitle="The Johnsons"
        onClick={() => setActiveSubPanel("edit-name")}
      />
      <ActionRow
        title="Change email"
        subtitle="contact@thejohnsons.com"
        onClick={() => setActiveSubPanel("change-email")}
      />
      <ActionRow
        title="Change password"
        onClick={() => setActiveSubPanel("change-password")}
      />
    </div>
  );

  const PreferencesSection = () => (
    <div className="space-y-3">
      <ActionRow
        title="Notification settings"
        subtitle="Email & Push"
        onClick={() => setActiveSubPanel("notifications")}
      />
      <ActionRow
        title="Activity preferences"
        subtitle="Trip updates"
        onClick={() => setActiveSubPanel("activity")}
      />
    </div>
  );

  const SectionContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2 mb-2">
        {title}
      </p>
      <div className="rounded-lg border border-border bg-white overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );

  // Desktop: Slide-over from right
  if (!isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={onClose}
        />
        
        {/* Slide-over panel */}
        <div
          className="fixed right-0 top-0 bottom-0 w-96 bg-background shadow-lg z-50 overflow-y-auto flex flex-col"
          style={{
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
            <h2 className="text-lg font-semibold text-foreground">Manage Profile</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-8">
            <SectionContainer title="Account">
              <AccountSection />
            </SectionContainer>
            <SectionContainer title="Preferences">
              <PreferencesSection />
            </SectionContainer>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 bg-background sticky bottom-0">
            <Button variant="outline" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Mobile: Full-screen modal
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      
      {/* Full-screen modal */}
      <div
        className="fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col"
        style={{
          animation: "slideUp 0.3s ease-out",
        }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <h2 className="text-lg font-semibold text-foreground">Manage Profile</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
          <SectionContainer title="Account">
            <AccountSection />
          </SectionContainer>
          <SectionContainer title="Preferences">
            <PreferencesSection />
          </SectionContainer>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-background sticky bottom-0">
          <Button variant="outline" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </>
  );
}

// Reusable action row component
function ActionRow({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
    >
      <div className="text-left">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
}
