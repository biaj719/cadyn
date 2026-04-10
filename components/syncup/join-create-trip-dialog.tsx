"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Link2, Plus } from "lucide-react";

interface JoinCreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinCreateTripDialog({ open, onOpenChange }: JoinCreateTripDialogProps) {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleCreateTrip = () => {
    console.log("[v0] Creating trip:", { tripName, destination, startDate, endDate });
    onOpenChange(false);
  };

  const handleJoinTrip = () => {
    console.log("[v0] Joining trip with code:", inviteCode);
    onOpenChange(false);
  };

  const isCreateValid = tripName && destination && startDate && endDate;
  const isJoinValid = inviteCode;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl">New Trip</DialogTitle>
          <DialogDescription>
            {activeTab === "create" 
              ? "Create a new trip and invite your travel companions"
              : "Join an existing trip using an invite code or link"}
          </DialogDescription>
        </DialogHeader>

        {/* iOS-style Segmented Control */}
        <div 
          style={{
            display: 'flex',
            gap: 0,
            padding: '3px',
            backgroundColor: '#F2F2F7',
            borderRadius: '10px',
          }}
        >
          <button
            onClick={() => setActiveTab("create")}
            style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: 500,
              padding: '6px 16px',
              backgroundColor: activeTab === "create" ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              boxShadow: activeTab === "create" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              color: activeTab === "create" ? '#1A1A1A' : '#9E9E9E',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab("join")}
            style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: 500,
              padding: '6px 16px',
              backgroundColor: activeTab === "join" ? '#FFFFFF' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              boxShadow: activeTab === "join" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              color: activeTab === "join" ? '#1A1A1A' : '#9E9E9E',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Join
          </button>
        </div>

        {/* Create Trip Tab */}
        {activeTab === "create" && (
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="trip-name" className="text-sm font-medium">Trip Name</Label>
              <Input
                id="trip-name"
                placeholder="e.g. Summer Beach Getaway"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                style={{
                  backgroundColor: '#F9F8F6',
                  border: '1px solid #EDE8E0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '15px',
                }}
                className="focus:border-[#2F6F5A] focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#2F6F5A'}
                onBlur={(e) => e.target.style.borderColor = '#EDE8E0'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="destination"
                  placeholder="e.g. Cabo San Lucas, Mexico"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  style={{
                    backgroundColor: '#F9F8F6',
                    border: '1px solid #EDE8E0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '15px',
                    paddingLeft: '36px',
                  }}
                  className="focus:border-[#2F6F5A] focus:outline-none"
                  onFocus={(e) => e.target.style.borderColor = '#2F6F5A'}
                  onBlur={(e) => e.target.style.borderColor = '#EDE8E0'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-sm font-medium">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      backgroundColor: '#F9F8F6',
                      border: '1px solid #EDE8E0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '15px',
                      paddingLeft: '36px',
                    }}
                    className="focus:border-[#2F6F5A] focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#2F6F5A'}
                    onBlur={(e) => e.target.style.borderColor = '#EDE8E0'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-sm font-medium">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      backgroundColor: '#F9F8F6',
                      border: '1px solid #EDE8E0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '15px',
                      paddingLeft: '36px',
                    }}
                    className="focus:border-[#2F6F5A] focus:outline-none"
                    onFocus={(e) => e.target.style.borderColor = '#2F6F5A'}
                    onBlur={(e) => e.target.style.borderColor = '#EDE8E0'}
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-10 gap-2 mt-2" 
              onClick={handleCreateTrip}
              disabled={!isCreateValid}
              style={{
                backgroundColor: isCreateValid ? '#3D5C50' : '#E5E5EA',
                color: isCreateValid ? '#FFFFFF' : '#C7C7CC',
                cursor: isCreateValid ? 'pointer' : 'not-allowed',
                border: 'none',
              }}
            >
              <Plus className="h-4 w-4" />
              Create Trip
            </Button>
          </div>
        )}

        {/* Join Trip Tab */}
        {activeTab === "join" && (
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="invite-code" className="text-sm font-medium">Invite Code or Link</Label>
              <Input
                id="invite-code"
                placeholder="e.g. CABO2026 or paste invite link"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                style={{
                  backgroundColor: '#F9F8F6',
                  border: '1px solid #EDE8E0',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '15px',
                }}
                className="focus:border-[#2F6F5A] focus:outline-none"
                onFocus={(e) => e.target.style.borderColor = '#2F6F5A'}
                onBlur={(e) => e.target.style.borderColor = '#EDE8E0'}
              />
              <p style={{
                fontSize: '12px',
                color: '#9E9E9E',
              }}>
                Enter the invite code or link shared by your trip organizer
              </p>
            </div>

            <Button 
              className="w-full h-10 mt-2" 
              onClick={handleJoinTrip}
              disabled={!isJoinValid}
              style={{
                backgroundColor: isJoinValid ? '#3D5C50' : '#E5E5EA',
                color: isJoinValid ? '#FFFFFF' : '#C7C7CC',
                cursor: isJoinValid ? 'pointer' : 'not-allowed',
                border: 'none',
              }}
            >
              Join Trip
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
