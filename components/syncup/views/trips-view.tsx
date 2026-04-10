"use client";

import { mockTrip, formatDateRange, getDaysUntilTrip, getNextTask, getUserTaskProgress } from "@/lib/mock-data";
import { MapPin, Plus, Calendar, Users, ArrowRight } from "lucide-react";

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
        position: 'relative',
        overflow: 'hidden',
        height: '240px',
        pointerEvents: 'none',
      }}>
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          viewBox="0 0 1000 240"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="hero-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#F5F0E8', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#EFE9E0', stopOpacity: 1 }} />
            </linearGradient>
            <pattern id="topo" patternUnits="userSpaceOnUse" width="200" height="240">
              <path d="M0,60 Q50,50 100,60 T200,60" fill="none" stroke="#2F6F5A" strokeWidth="0.4" opacity="0.06" />
              <path d="M0,120 Q50,110 100,120 T200,120" fill="none" stroke="#2F6F5A" strokeWidth="0.4" opacity="0.05" />
              <path d="M0,180 Q50,170 100,180 T200,180" fill="none" stroke="#2F6F5A" strokeWidth="0.4" opacity="0.04" />
            </pattern>
          </defs>
          <rect width="1000" height="240" fill="url(#hero-bg)" />
          <rect width="1000" height="240" fill="url(#topo)" />
          <g>
            <circle cx="750" cy="80" r="10" fill="#2F6F5A" opacity="0.12" />
            <circle cx="750" cy="80" r="5" fill="#2F6F5A" opacity="0.5" />
            <circle cx="750" cy="80" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>
          <g>
            <circle cx="200" cy="140" r="10" fill="#2F6F5A" opacity="0.12" />
            <circle cx="200" cy="140" r="5" fill="#2F6F5A" opacity="0.5" />
            <circle cx="200" cy="140" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>
          <g>
            <circle cx="550" cy="180" r="10" fill="#2F6F5A" opacity="0.12" />
            <circle cx="550" cy="180" r="5" fill="#2F6F5A" opacity="0.5" />
            <circle cx="550" cy="180" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>
        </svg>

        {/* Text overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1F1F1F', marginBottom: '4px' }}>
              Your Travel Life
            </h2>
            <p style={{ fontSize: '13px', color: '#8A847C' }}>3 trips · 20 experiences</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={13} color="#2F6F5A" />
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#2F6F5A' }}>
              Next trip in {daysLeft} days
            </span>
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
