"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ClipboardCheck, Sparkles, Calculator, Settings, Pencil, Plus } from "lucide-react";
import { mockTrip } from "@/lib/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConfigureTripPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isOrganizer?: boolean;
}

export function ConfigureTripPanel({ isOpen, onClose, isOrganizer = true }: ConfigureTripPanelProps) {
  const isMobile = useIsMobile();
  
  // Trip Details editable state
  const [tripName, setTripName] = useState(mockTrip.name);
  const [destination, setDestination] = useState(mockTrip.destination);
  const [startDate, setStartDate] = useState(mockTrip.startDate);
  const [endDate, setEndDate] = useState(mockTrip.endDate);
  
  // Required items state
  const [requiredItems, setRequiredItems] = useState([
    { id: 1, name: "Book flights", cost: 800, dueDate: "2026-04-20" },
    { id: 2, name: "Book hotel", cost: 500, dueDate: "2026-04-20" },
    { id: 3, name: "Get travel insurance", cost: 150, dueDate: "2026-04-15" },
  ]);

  // Optional activities state
  const [optionalActivities, setOptionalActivities] = useState([
    { id: 1, name: "Snorkeling tour", cost: 120, rsvpDate: "2026-04-25" },
    { id: 2, name: "Sunset dinner cruise", cost: 200, rsvpDate: "2026-04-26" },
  ]);
  
  // Edit mode tracking
  const [editingField, setEditingField] = useState<string | null>(null);

  if (!isOpen) return null;

  const InlineEditField = ({
    label,
    value,
    onChange,
    type = "text",
    isDisabled = false,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: "text" | "date" | "number";
    isDisabled?: boolean;
  }) => {
    const fieldId = `field-${label}`;
    const isEditing = editingField === fieldId;

    return (
      <div className="px-4 py-3 border-b border-border last:border-b-0">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">{label}</p>
        {isEditing && !isDisabled ? (
          <div className="flex items-center gap-2">
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              style={{
                backgroundColor: '#F9F8F6',
                border: '1px solid #2F6F5A',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '14px',
                flex: 1,
              }}
              autoFocus
            />
            <button
              onClick={() => setEditingField(null)}
              className="text-sm font-medium text-primary hover:text-primary/80 whitespace-nowrap"
            >
              Save
            </button>
          </div>
        ) : (
          <input
            type={type}
            value={value}
            readOnly
            onClick={() => !isDisabled && setEditingField(fieldId)}
            onMouseEnter={(e) => !isDisabled && (e.currentTarget.style.cursor = 'text')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #EDE8E0',
              padding: 0,
              fontSize: '14px',
              width: '100%',
              cursor: isDisabled ? 'default' : 'text',
            }}
            className="focus:outline-none focus:border-primary"
            disabled={isDisabled}
          />
        )}
      </div>
    );
  };

  const InlineEditDateRange = () => {
    const fieldId = "field-dates";
    const isEditing = editingField === fieldId;

    return (
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Dates</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-2 flex-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  backgroundColor: '#F9F8F6',
                  border: '1px solid #2F6F5A',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '14px',
                  flex: 1,
                }}
              />
              <span className="text-muted-foreground px-1 py-1">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  backgroundColor: '#F9F8F6',
                  border: '1px solid #2F6F5A',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '14px',
                  flex: 1,
                }}
              />
            </div>
            <button
              onClick={() => setEditingField(null)}
              className="text-sm font-medium text-primary hover:text-primary/80 whitespace-nowrap"
            >
              Save
            </button>
          </div>
        ) : (
          <div
            onClick={() => setEditingField(fieldId)}
            onMouseEnter={(e) => (e.currentTarget.style.cursor = 'text')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: '1px solid #EDE8E0',
              padding: 0,
              fontSize: '14px',
              cursor: 'text',
            }}
          >
            {startDate} to {endDate}
          </div>
        )}
      </div>
    );
  };

  const ActionRow = ({
    title,
    subtitle,
    onClick,
    isDangerous = false,
    isInteractive = true,
    helperText,
  }: {
    title: string;
    subtitle?: string;
    onClick: () => void;
    isDangerous?: boolean;
    isInteractive?: boolean;
    helperText?: string;
  }) => (
    <div
      className={`w-full flex items-center justify-between px-4 py-3 ${
        isInteractive ? "hover:bg-muted/50 transition-colors cursor-pointer" : "cursor-default"
      } ${isDangerous ? "hover:bg-red-50" : ""}`}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? "button" : undefined}
    >
      <div className="text-left">
        <p className={`text-sm font-medium ${isDangerous ? "text-red-600" : "text-foreground"}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
        {helperText && (
          <p className="text-xs text-muted-foreground/70 italic mt-0.5">{helperText}</p>
        )}
      </div>
      {isInteractive && (
        <ChevronRight className={`h-5 w-5 flex-shrink-0 ${isDangerous ? "text-red-600" : "text-muted-foreground"}`} />
      )}
    </div>
  );

  const SectionContainer = ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => (
    <div>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2 mb-2">
        {title}
      </div>
      <div className="rounded-lg border border-border bg-white overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  );

  const ItemRow = ({
    name,
    badge,
    cost,
    date,
    dateLabel,
    onEdit,
  }: {
    name: string;
    badge: string;
    cost?: number;
    date?: string;
    dateLabel?: string;
    onEdit: () => void;
  }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #EDE8E0',
      }}
      className="px-4"
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>{name}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: '#E8F5E9',
            color: '#2F6F5A',
            padding: '2px 8px',
            borderRadius: '4px',
          }}>
            {badge}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '12px', color: '#9E9E9E' }}>
          {cost !== undefined && <span>${cost}</span>}
          {date && dateLabel && <span>{dateLabel}: {date}</span>}
        </div>
      </div>
      <button
        onClick={onEdit}
        style={{ cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
      >
        <Pencil size={14} color="#C7C7CC" />
      </button>
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
            <h2 className="text-lg font-semibold text-foreground">Configure Trip</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-8">
            {/* Trip Details */}
            <SectionContainer title="Trip Details">
              <div>
                {isOrganizer ? (
                  <>
                    <InlineEditField
                      label="Trip Name"
                      value={tripName}
                      onChange={setTripName}
                    />
                    <InlineEditField
                      label="Destination"
                      value={destination}
                      onChange={setDestination}
                    />
                    <InlineEditDateRange />
                  </>
                ) : (
                  <>
                    <InlineEditField
                      label="Trip Name"
                      value={tripName}
                      onChange={() => {}}
                      isDisabled={true}
                    />
                    <InlineEditField
                      label="Destination"
                      value={destination}
                      onChange={() => {}}
                      isDisabled={true}
                    />
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Dates</p>
                      <div style={{ fontSize: '14px', color: '#9E9E9E' }}>
                        {startDate} to {endDate}
                      </div>
                      <p className="text-xs text-muted-foreground/70 italic mt-1">Managed by organizer</p>
                    </div>
                  </>
                )}
              </div>
            </SectionContainer>

            {/* Group Setup */}
            <SectionContainer title="Group Setup">
              <div className="space-y-3">
                <ActionRow
                  title="Manage travelers"
                  subtitle="4 travelers"
                  onClick={() => {}}
                  isInteractive={isOrganizer}
                  helperText={!isOrganizer ? "Managed by organizer" : undefined}
                />
                {isOrganizer && (
                  <ActionRow
                    title="Edit household names"
                    onClick={() => {}}
                    isInteractive={true}
                  />
                )}
                {!isOrganizer && (
                  <ActionRow
                    title="Edit your household name"
                    onClick={() => {}}
                    isInteractive={true}
                  />
                )}
              </div>
            </SectionContainer>

            {/* Planning Rules - Organizer only */}
            {isOrganizer && (
              <>
                {/* Required Items Section */}
                <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ClipboardCheck size={14} color="#8E8E93" />Required Items</div>}>
                  <div className="px-4 py-3">
                    {requiredItems.map((item) => (
                      <ItemRow
                        key={item.id}
                        name={item.name}
                        badge="Required"
                        cost={item.cost}
                        date={item.dueDate}
                        dateLabel="Due"
                        onEdit={() => {}}
                      />
                    ))}
                    <div style={{ paddingTop: '10px', paddingBottom: '4px' }}>
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          color: '#2F6F5A',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'none',
                          fontWeight: 500,
                        }}
                        onClick={() => {}}
                      >
                        <Plus size={14} />
                        Add required item
                      </button>
                    </div>
                  </div>
                </SectionContainer>

                {/* Optional Activities Section */}
                <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} color="#8E8E93" />Optional Activities</div>}>
                  <div className="px-4 py-3">
                    {optionalActivities.map((activity) => (
                      <ItemRow
                        key={activity.id}
                        name={activity.name}
                        badge="Optional"
                        cost={activity.cost}
                        date={activity.rsvpDate}
                        dateLabel="RSVP"
                        onEdit={() => {}}
                      />
                    ))}
                    <div style={{ paddingTop: '10px', paddingBottom: '4px' }}>
                      <button
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          color: '#2F6F5A',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'none',
                          fontWeight: 500,
                        }}
                        onClick={() => {}}
                      >
                        <Plus size={14} />
                        Add optional activity
                      </button>
                    </div>
                  </div>
                </SectionContainer>

                {/* Estimated Costs Section */}
                <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calculator size={14} color="#8E8E93" />Estimated Costs</div>}>
                  <div className="px-4 py-4 space-y-3">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Essentials total</span>
                      <span style={{ fontWeight: 600, color: '#1A1A1A' }}>${requiredItems.reduce((sum, item) => sum + (item.cost || 0), 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Activities total</span>
                      <span style={{ fontWeight: 600, color: '#1A1A1A' }}>${optionalActivities.reduce((sum, item) => sum + (item.cost || 0), 0)}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #EDE8E0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Combined estimate</span>
                      <span style={{ fontWeight: 600, color: '#1A1A1A' }}>${requiredItems.reduce((sum, item) => sum + (item.cost || 0), 0) + optionalActivities.reduce((sum, item) => sum + (item.cost || 0), 0)}</span>
                    </div>
                  </div>
                </SectionContainer>
              </>
            )}

            {/* Trip Preferences */}
            <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={14} color="#8E8E93" />Preferences</div>}>
              <div className="space-y-3">
                <ActionRow
                  title="Activity preferences"
                  onClick={() => {}}
                />
                <ActionRow
                  title="Notification style"
                  onClick={() => {}}
                />
              </div>
            </SectionContainer>

            {/* Danger Zone - Organizer only */}
            {isOrganizer && (
              <SectionContainer title="Danger Zone">
                <div className="space-y-3">
                  <ActionRow
                    title="Leave trip"
                    onClick={() => {}}
                    isDangerous
                  />
                  <ActionRow
                    title="Delete trip"
                    onClick={() => {}}
                    isDangerous
                  />
                </div>
              </SectionContainer>
            )}

            {/* Leave Trip - Traveler only */}
            {!isOrganizer && (
              <SectionContainer title="Trip">
                <ActionRow
                  title="Leave trip"
                  onClick={() => {}}
                  isDangerous
                />
              </SectionContainer>
            )}
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
          <h2 className="text-lg font-semibold text-foreground">Configure Trip</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
          {/* Trip Details */}
          <SectionContainer title="Trip Details">
            <div>
              {isOrganizer ? (
                <>
                  <InlineEditField
                    label="Trip Name"
                    value={tripName}
                    onChange={setTripName}
                  />
                  <InlineEditField
                    label="Destination"
                    value={destination}
                    onChange={setDestination}
                  />
                  <InlineEditDateRange />
                </>
              ) : (
                <>
                  <InlineEditField
                    label="Trip Name"
                    value={tripName}
                    onChange={() => {}}
                    isDisabled={true}
                  />
                  <InlineEditField
                    label="Destination"
                    value={destination}
                    onChange={() => {}}
                    isDisabled={true}
                  />
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Dates</p>
                    <div style={{ fontSize: '14px', color: '#9E9E9E' }}>
                      {startDate} to {endDate}
                    </div>
                    <p className="text-xs text-muted-foreground/70 italic mt-1">Managed by organizer</p>
                  </div>
                </>
              )}
            </div>
          </SectionContainer>

          {/* Group Setup */}
          <SectionContainer title="Group Setup">
            <div className="space-y-3">
              <ActionRow
                title="Manage travelers"
                subtitle="4 travelers"
                onClick={() => {}}
                isInteractive={isOrganizer}
                helperText={!isOrganizer ? "Managed by organizer" : undefined}
              />
              {isOrganizer && (
                <ActionRow
                  title="Edit household names"
                  onClick={() => {}}
                  isInteractive={true}
                />
              )}
              {!isOrganizer && (
                <ActionRow
                  title="Edit your household name"
                  onClick={() => {}}
                  isInteractive={true}
                />
              )}
            </div>
          </SectionContainer>

          {/* Planning Rules - Organizer only */}
          {isOrganizer && (
            <>
              {/* Required Items Section */}
              <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ClipboardCheck size={14} color="#8E8E93" />Required Items</div>}>
                <div className="px-4 py-3">
                  {requiredItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      name={item.name}
                      badge="Required"
                      cost={item.cost}
                      date={item.dueDate}
                      dateLabel="Due"
                      onEdit={() => {}}
                    />
                  ))}
                  <div style={{ paddingTop: '10px', paddingBottom: '4px' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: '#2F6F5A',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        fontWeight: 500,
                      }}
                      onClick={() => {}}
                    >
                      <Plus size={14} />
                      Add required item
                    </button>
                  </div>
                </div>
              </SectionContainer>

              {/* Optional Activities Section */}
              <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Sparkles size={14} color="#8E8E93" />Optional Activities</div>}>
                <div className="px-4 py-3">
                  {optionalActivities.map((activity) => (
                    <ItemRow
                      key={activity.id}
                      name={activity.name}
                      badge="Optional"
                      cost={activity.cost}
                      date={activity.rsvpDate}
                      dateLabel="RSVP"
                      onEdit={() => {}}
                    />
                  ))}
                  <div style={{ paddingTop: '10px', paddingBottom: '4px' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: '#2F6F5A',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        fontWeight: 500,
                      }}
                      onClick={() => {}}
                    >
                      <Plus size={14} />
                      Add optional activity
                    </button>
                  </div>
                </div>
              </SectionContainer>

              {/* Estimated Costs Section */}
              <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calculator size={14} color="#8E8E93" />Estimated Costs</div>}>
                <div className="px-4 py-4 space-y-3">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Essentials total</span>
                    <span style={{ fontWeight: 600, color: '#1A1A1A' }}>${requiredItems.reduce((sum, item) => sum + (item.cost || 0), 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Activities total</span>
                    <span style={{ fontWeight: 600, color: '#1A1A1A' }}>${optionalActivities.reduce((sum, item) => sum + (item.cost || 0), 0)}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #EDE8E0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Combined estimate</span>
                    <span style={{ fontWeight: 600, color: '#1A1A1A' }}>${requiredItems.reduce((sum, item) => sum + (item.cost || 0), 0) + optionalActivities.reduce((sum, item) => sum + (item.cost || 0), 0)}</span>
                  </div>
                </div>
              </SectionContainer>
            </>
          )}

          {/* Trip Preferences */}
          <SectionContainer title={<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Settings size={14} color="#8E8E93" />Preferences</div>}>
            <div className="space-y-3">
              <ActionRow
                title="Activity preferences"
                onClick={() => {}}
              />
              <ActionRow
                title="Notification style"
                onClick={() => {}}
              />
            </div>
          </SectionContainer>

          {/* Danger Zone - Organizer only */}
          {isOrganizer && (
            <SectionContainer title="Danger Zone">
              <div className="space-y-3">
                <ActionRow
                  title="Leave trip"
                  onClick={() => {}}
                  isDangerous
                />
                <ActionRow
                  title="Delete trip"
                  onClick={() => {}}
                  isDangerous
                />
              </div>
            </SectionContainer>
          )}

          {/* Leave Trip - Traveler only */}
          {!isOrganizer && (
            <SectionContainer title="Trip">
              <ActionRow
                title="Leave trip"
                onClick={() => {}}
                isDangerous
              />
            </SectionContainer>
          )}
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
