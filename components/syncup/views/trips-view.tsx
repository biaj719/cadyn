"use client";

import 'leaflet/dist/leaflet.css';
import { mockTrip, formatDateRange, getDaysUntilTrip, getNextTask, getUserTaskProgress } from "@/lib/mock-data";
import { MapPin, Plus, Calendar, Users, ArrowRight } from "lucide-react";
import { TripMap } from "../trip-map";

interface TripsViewProps {
  onSelectTrip: () => void;
  onOpenJoinCreateDialog?: () => void;
}

export function TripsView({ onSelectTrip, onOpenJoinCreateDialog }: TripsViewProps) {
  const dateRange = formatDateRange(mockTrip.startDate, mockTrip.endDate);
  const daysLeft = getDaysUntilTrip(mockTrip.startDate);
  const nextTask = getNextTask();
  const userProgress = getUserTaskProgress();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1F1F1F' }}>My Trips</h1>
          <p style={{ fontSize: '14px', color: '#8A847C', marginTop: '4px' }}>Manage and track your group travel plans</p>
        </div>
        <button
          onClick={onOpenJoinCreateDialog}
          style={{
            background: '#3D5C50',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} />
          New Trip
        </button>
      </div>

      {/* Map hero */}
      <div style={{
        backgroundColor: '#FAF8F3',
        borderRadius: '16px',
        border: '1px solid #E6DED3',
        marginBottom: '28px',
        overflow: 'hidden',
      }}>
        <TripMap
          height="220px"
          pins={[
            { lat: 22.8905, lng: -109.9167, name: "Cabo Trip 2026" },
          ]}
        />
        <div style={{ padding: '16px 20px', borderTop: '1px solid #E6DED3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1F1F1F' }}>Your Travel Life</div>
            <div style={{ fontSize: '12px', color: '#8A847C', marginTop: '2px' }}>3 trips · 20 experiences</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2F6F5A" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#2F6F5A' }}>Next trip in {daysLeft} days</span>
          </div>
        </div>
      </div>

      {/* Section label */}
      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8A847C', marginBottom: '16px' }}>
        Current &amp; Upcoming
      </p>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>

        {/* Trip card */}
        <div
          onClick={onSelectTrip}
          style={{
            background: '#FFFCF8',
            border: '1px solid #E6DED3',
            borderRadius: '16px',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {/* Cover */}
          <div style={{
            height: '160px',
            background: 'linear-gradient(135deg, #E3EFE9 0%, #F0F7F4 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: '12px',
          }}>
            <span style={{
              background: 'rgba(255,255,255,0.85)',
              borderRadius: '99px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#1F1F1F',
            }}>
              {daysLeft} days away
            </span>
          </div>

          {/* Content */}
          <div style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#1F1F1F', marginBottom: '12px' }}>
              {mockTrip.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="#8A847C" />
                <span style={{ fontSize: '13px', color: '#6F6A63' }}>{mockTrip.destination}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} color="#8A847C" />
                <span style={{ fontSize: '13px', color: '#6F6A63' }}>{dateRange}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={14} color="#8A847C" />
                <span style={{ fontSize: '13px', color: '#6F6A63' }}>{mockTrip.households.length} households</span>
              </div>
            </div>

            {nextTask && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <ArrowRight size={14} color="#8A847C" />
                <span style={{ fontSize: '12px', color: '#8A847C' }}>
                  <strong style={{ color: '#1F1F1F' }}>Next:</strong> {nextTask.title}
                </span>
              </div>
            )}

            {/* Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '6px', background: '#EFE9E0', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${userProgress}%`, background: '#2F6F5A', borderRadius: '99px' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#8A847C', fontWeight: 500 }}>{userProgress}%</span>
            </div>
          </div>
        </div>

        {/* Add trip card */}
        <div
          onClick={onOpenJoinCreateDialog}
          style={{
            background: '#FFFCF8',
            border: '2px dashed #E6DED3',
            borderRadius: '16px',
            minHeight: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#EFE9E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Plus size={22} color="#6F6A63" />
            </div>
            <p style={{ fontSize: '15px', fontWeight: 500, color: '#1F1F1F' }}>Start a new trip</p>
            <p style={{ fontSize: '13px', color: '#8A847C', marginTop: '4px' }}>Plan with your group</p>
          </div>
        </div>

      </div>
    </div>
  );
}
