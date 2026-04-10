"use client";

import { cn } from "@/lib/utils";
import { Home, CheckSquare, Users, PiggyBank, Activity, Menu, X, Bell, Settings, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CadynLogo } from "@/components/cadyn-logo";
import { useState } from "react";

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

interface AppShellProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: string) => void;
  tripName?: string;
}

const mainNav = [
  { id: "trip-overview" as View, label: "Overview", icon: Home },
  { id: "my-plan" as View, label: "My Plan", icon: CheckSquare },
  { id: "groups" as View, label: "Groups", icon: Users },
  { id: "wallet" as View, label: "Wallet", icon: PiggyBank },
  { id: "activity" as View, label: "Activity", icon: Activity },
];

export function AppShell({ children, currentView, onNavigate, tripName }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col border-r border-border bg-card">
        {/* Logo / Brand */}
        <button
          type="button"
          onClick={() => onNavigate("trips")}
          className="flex h-16 items-center px-6 border-b border-border hover:bg-muted/50 transition-colors w-full"
        >
          <CadynLogo />
        </button>

        {/* Trip context */}
        {tripName && (
          <div className="border-b border-border">
            <button
              type="button"
              onClick={() => onNavigate("trips")}
              className="px-4 py-2 w-full text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs text-muted-foreground">← Back to My Trips</span>
            </button>
            <div className="px-4 py-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Trip</p>
              <p className="font-medium text-foreground mt-0.5 truncate">{tripName}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          {/* Primary Navigation label */}
          <p className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Navigation</p>
          
          <div className="space-y-1">
            {mainNav.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#E6F0EC] text-[#2E2A26]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#EDE8E0', margin: '0 12px' }} />

        {/* Trip Actions Section */}
        <div className="px-3 py-3">
          <p className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Trip Actions</p>
          
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onNavigate("trip-settings")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              Configure Trip
            </button>
            <button
              type="button"
              onClick={() => onNavigate("manage-profile")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Users className="h-4 w-4" />
              Manage Profile
            </button>
          </div>
        </div>

        {/* Notification bell - desktop */}
        <div className="border-t border-border px-3 py-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-3 relative"
            onClick={() => onNavigate("notifications")}
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
            <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary" />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={async () => {
              const { createBrowserClient } = await import('@supabase/ssr');
              const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
              );
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#8A847C',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>

        {/* Organizer indicator removed - capabilities integrated into screens */}
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-4">
          <button
            type="button"
            onClick={() => onNavigate("trips")}
            className="hover:opacity-80 transition-opacity"
          >
            <CadynLogo />
          </button>
          <div className="flex items-center gap-2">
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 relative"
              onClick={() => onNavigate("notifications")}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <Button 
              type="button"
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-14 right-0 w-64 shadow-xl h-[calc(100vh-3.5rem)] overflow-y-auto"
            style={{ backgroundColor: '#FDFCFA' }}
            onClick={(e) => e.stopPropagation()}
          >
            {tripName && (
              <>
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("trips");
                    setMobileMenuOpen(false);
                  }}
                  style={{ 
                    padding: '12px 16px',
                    width: '100%',
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#1A1A1A',
                    fontWeight: 500
                  }}
                >
                  ← Back to My Trips
                </button>

                {/* Trip info section */}
                <div style={{ padding: '16px' }}>
                  <p style={{ 
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: '#9E9E9E',
                    textTransform: 'uppercase',
                    margin: '0 0 8px 0'
                  }}>Current Trip</p>
                  <p style={{ 
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1A1A1A',
                    margin: '0 0 4px 0'
                  }}>{tripName}</p>
                  <p style={{ 
                    fontSize: '13px',
                    color: '#9E9E9E',
                    margin: 0
                  }}>Cabo San Lucas · Jun 15–22</p>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#EDE8E0', margin: '0' }} />

                {/* Action rows */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate("trip-settings");
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Settings size={16} color="#1A1A1A" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: 500, flex: 1, textAlign: 'left' }}>Configure Trip</span>
                    <ChevronRight size={16} color="#C7C7CC" style={{ flexShrink: 0 }} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigate("manage-profile");
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Users size={16} color="#1A1A1A" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: 500, flex: 1, textAlign: 'left' }}>Manage Profile</span>
                    <ChevronRight size={16} color="#C7C7CC" style={{ flexShrink: 0 }} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onNavigate("notifications");
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: '1px solid transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Bell size={16} color="#1A1A1A" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: 500, flex: 1, textAlign: 'left' }}>Notification Settings</span>
                    <ChevronRight size={16} color="#C7C7CC" style={{ flexShrink: 0 }} />
                  </button>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: '#EDE8E0', margin: '0' }} />

                {/* Leave Trip button */}
                <button
                  type="button"
                  onClick={() => {
                    onNavigate("trips");
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} color="#FF3B30" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '15px', color: '#FF3B30', fontWeight: 500 }}>Leave Trip</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-around py-2">
          {mainNav.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main content area */}
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
