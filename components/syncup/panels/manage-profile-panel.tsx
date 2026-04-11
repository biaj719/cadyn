"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManageProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const fieldLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#6F6A63',
  display: 'block',
  marginBottom: '6px',
};

const fieldInput: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #E6DED3',
  fontSize: '14px',
  background: '#F5F2EC',
  color: '#1F1F1F',
  outline: 'none',
  boxSizing: 'border-box',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#8A847C',
  marginBottom: '12px',
};

export function ManageProfilePanel({ isOpen, onClose }: ManageProfilePanelProps) {
  const isMobile = useIsMobile();
  const [displayName, setDisplayName] = useState('Bianca');
  const [email] = useState('biancabjones@gmail.com');
  const [tripReminders, setTripReminders] = useState(true);
  const [groupActivity, setGroupActivity] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const PanelContent = ({ padding }: { padding: string }) => (
    <>
      <div style={{ flex: 1, padding, display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Account section */}
        <div>
          <p style={sectionTitle}>Account</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={fieldLabel}>Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                style={fieldInput}
              />
            </div>
            <div>
              <label style={fieldLabel}>Email</label>
              <input
                type="email"
                value={email}
                readOnly
                style={{ ...fieldInput, color: '#8A847C', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '11px', color: '#8A847C', marginTop: '5px' }}>
                Contact support to change your email address.
              </p>
            </div>
          </div>
        </div>

        {/* Preferences section */}
        <div>
          <p style={sectionTitle}>Preferences</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0', borderBottom: '1px solid #E6DED3', cursor: 'pointer',
            }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1F1F1F' }}>Trip reminders</p>
                <p style={{ fontSize: '12px', color: '#8A847C', marginTop: '2px' }}>Deadlines and upcoming dates</p>
              </div>
              <input
                type="checkbox"
                checked={tripReminders}
                onChange={e => setTripReminders(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3D5C50', cursor: 'pointer' }}
              />
            </label>
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 0', cursor: 'pointer',
            }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1F1F1F' }}>Group activity</p>
                <p style={{ fontSize: '12px', color: '#8A847C', marginTop: '2px' }}>When others complete tasks or add updates</p>
              </div>
              <input
                type="checkbox"
                checked={groupActivity}
                onChange={e => setGroupActivity(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#3D5C50', cursor: 'pointer' }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #E6DED3',
        padding: '16px 24px',
        background: 'inherit',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <Button
          onClick={handleSave}
          style={{
            flex: 1,
            background: saved ? '#2F6F5A' : '#3D5C50',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </Button>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '14px',
            color: '#8A847C',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );

  if (!isMobile) {
    return (
      <>
        <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />
        <div
          className="fixed right-0 top-0 bottom-0 w-96 bg-background shadow-lg z-50 overflow-y-auto flex flex-col"
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
          <div className="flex items-center p-6 border-b border-border sticky top-0 bg-background">
            <h2 className="text-lg font-semibold text-foreground">Manage Profile</h2>
          </div>
          <PanelContent padding="24px" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 bg-background overflow-y-auto flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        <div className="flex items-center p-4 border-b border-border sticky top-0 bg-background">
          <h2 className="text-lg font-semibold text-foreground">Manage Profile</h2>
        </div>
        <PanelContent padding="16px" />
      </div>
    </>
  );
}
