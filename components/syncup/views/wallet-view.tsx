"use client";

import { getCurrentUserSavings, getDaysUntilTrip, mockTrip } from "@/lib/mock-data";
import { colors, borderRadius, shadows, getProgressBarContainerStyle, getProgressBarFillStyle } from "@/lib/design-tokens";
import { PiggyBank } from "lucide-react";
import { PageTitle, PageContent } from "../page-layout";

export function WalletView() {
  const savings = getCurrentUserSavings();
  const daysUntilTrip = getDaysUntilTrip(mockTrip.startDate);
  const weeksUntilTrip = Math.ceil(daysUntilTrip / 7);
  const progress = Math.round((savings.saved / savings.goal) * 100);
  const remaining = savings.goal - savings.saved;
  const weeklyPace = weeksUntilTrip > 0 ? Math.ceil(remaining / weeksUntilTrip) : 0;

  // Mock shared payments data
  const sharedPayments = [
    {
      id: 1,
      title: "Villa Deposit",
      paidBy: "you",
      splitBetween: 4,
      total: 400,
      yourShare: 100,
      youPaidForOthers: 300,
      unsettled: [
        { name: "Mom", amount: 100 },
        { name: "Son", amount: 100 },
      ],
      settled: false,
    },
    {
      id: 2,
      title: "Group dinner",
      paidBy: "Tasha",
      splitBetween: 3,
      total: 105,
      yourShare: 35,
      youOwe: 35,
      settled: false,
    },
    {
      id: 3,
      title: "Snorkeling tour",
      paidBy: "Mom",
      splitBetween: 4,
      total: 280,
      yourShare: 70,
      settled: true,
    },
  ];

  const totalRecorded = sharedPayments.reduce((s, p) => s + p.total, 0);
  const totalPaid = sharedPayments.filter(p => p.settled).reduce((s, p) => s + p.total, 0);
  const totalStillOwed = sharedPayments.filter(p => !p.settled).reduce((s, p) => s + (p.unsettled?.reduce((a, b) => a + b.amount, 0) || p.youOwe || 0), 0);

  const s = {
    card: { background: colors.card, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px' } as React.CSSProperties,
    secLabel: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: colors.textMuted, marginBottom: '10px' },
    metaItem: { background: colors.background, borderRadius: '10px', padding: '12px 14px' } as React.CSSProperties,
    metaLabel: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: colors.textMuted, marginBottom: '4px' },
    metaVal: { fontSize: '16px', fontWeight: 600, color: colors.textPrimary },
    badge: (type: 'orange' | 'green') => ({
      fontSize: '11px', padding: '3px 9px', borderRadius: '99px', fontWeight: 500,
      background: type === 'orange' ? '#F6E7D8' : '#E3EFE9',
      color: type === 'orange' ? '#8B4F1A' : colors.success,
    } as React.CSSProperties),
    btn: { background: '#3D5C50', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', fontFamily: 'inherit' } as React.CSSProperties,
    btnSec: { background: '#EAE4DC', color: '#2E2A26', border: '1px solid #D8CFC5', borderRadius: '12px', padding: '11px 22px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' } as React.CSSProperties,
    dividerLine: { flex: 1, height: '1px', background: colors.border } as React.CSSProperties,
    dividerText: { fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: colors.textMuted, whiteSpace: 'nowrap' as const },
    expRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: `1px solid ${colors.border}` } as React.CSSProperties,
  };

  return (
    <div>
      <PageTitle
        icon={<PiggyBank size={22} color="#8A847C" />}
        title="Wallet"
        subtitle="Your trip finances"
      />
      <PageContent>
        {/* Row 1: Trip Fund + Balance — 2 col on desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>

          {/* Trip Fund */}
          <div>
            <div style={s.secLabel}>Your Trip Fund</div>
            <div style={{ ...s.card, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '38px', fontWeight: 700, color: colors.success, lineHeight: 1, marginBottom: '4px' }}>{progress}% saved</div>
              <div style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '18px' }}>${savings.saved.toLocaleString()} of ${savings.goal.toLocaleString()}</div>
              <div style={{ ...getProgressBarContainerStyle(), marginBottom: '18px' }}>
                <div style={getProgressBarFillStyle(progress)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={s.metaItem}>
                  <div style={s.metaLabel}>Remaining</div>
                  <div style={s.metaVal}>${remaining.toLocaleString()}</div>
                </div>
                <div style={s.metaItem}>
                  <div style={s.metaLabel}>Weekly pace</div>
                  <div style={s.metaVal}>${weeklyPace}/week</div>
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <button style={s.btn}>Add to savings</button>
            </div>
          </div>

          {/* Your Balance */}
          <div>
            <div style={s.secLabel}>Your Balance</div>
            <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'You paid', val: '$420' },
                  { label: 'Your share', val: '$180' },
                  { label: "You're owed", val: '$240', color: colors.success },
                  { label: 'You owe', val: '$35', color: '#D98E4F' },
                ].map(item => (
                  <div key={item.label} style={s.metaItem}>
                    <div style={s.metaLabel}>{item.label}</div>
                    <div style={{ ...s.metaVal, color: item.color || colors.textPrimary }}>{item.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#E3EFE9', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.success }}>Net balance</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: colors.success }}>+$205</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <div style={{ ...s.metaLabel, marginBottom: '8px' }}>Owes you</div>
                  {[{ name: 'Mom', amt: '$40' }, { name: 'Son', amt: '$100' }, { name: 'Dad', amt: '$100' }].map(p => (
                    <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${colors.border}` }}>
                      <span style={{ fontSize: '13px', color: colors.textPrimary }}>{p.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: colors.success }}>{p.amt}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ ...s.metaLabel, marginBottom: '8px' }}>You owe</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${colors.border}` }}>
                    <span style={{ fontSize: '13px', color: colors.textPrimary }}>Tasha</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#D98E4F' }}>$35</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={s.dividerLine} />
          <div style={s.dividerText}>Shared Payments</div>
          <div style={s.dividerLine} />
        </div>

        {/* Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { label: 'Recorded', val: `$${totalRecorded}` },
            { label: 'Paid', val: `$${totalPaid}`, color: colors.success },
            { label: 'Still owed', val: `$${totalStillOwed}`, color: '#D98E4F' },
          ].map(item => (
            <div key={item.label} style={{ ...s.card, padding: '12px 16px' }}>
              <div style={s.metaLabel}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: item.color || colors.textPrimary }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Expense cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {sharedPayments.map(payment => (
            <div key={payment.id} style={s.card}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '3px' }}>{payment.title}</div>
              <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '12px' }}>
                Paid by {payment.paidBy} · Split between {payment.splitBetween}
              </div>
              <div style={s.expRow}>
                <span style={{ fontSize: '12px', color: colors.textSecondary }}>Total</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>${payment.total}</span>
              </div>
              <div style={s.expRow}>
                <span style={{ fontSize: '12px', color: colors.textSecondary }}>Your share</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textPrimary }}>${payment.yourShare}</span>
              </div>
              {payment.settled ? (
                <div style={s.expRow}>
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>Status</span>
                  <span style={s.badge('green')}>Settled</span>
                </div>
              ) : payment.youOwe ? (
                <div style={s.expRow}>
                  <span style={{ fontSize: '12px', color: colors.textSecondary }}>Status</span>
                  <span style={s.badge('orange')}>You owe ${payment.youOwe}</span>
                </div>
              ) : (
                <>
                  <div style={s.expRow}>
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>Still owed to you</span>
                    <span style={s.badge('orange')}>${payment.unsettled?.reduce((a, b) => a + b.amount, 0)}</span>
                  </div>
                  {payment.unsettled?.map(u => (
                    <div key={u.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span style={{ fontSize: '12px', color: colors.textSecondary }}>{u.name} owes you</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#D98E4F' }}>${u.amount}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div>
          <div style={s.secLabel}>Actions</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button style={{ ...s.btn, width: 'auto', padding: '11px 24px' }}>Add to savings</button>
            <button style={s.btnSec}>Record payment</button>
            <button style={s.btnSec}>Settle up</button>
          </div>
        </div>
      </PageContent>
    </div>
  );
}
