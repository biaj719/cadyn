"use client";

import { useState } from 'react';
import { getCurrentUserSavings, getDaysUntilTrip, mockTrip } from "@/lib/mock-data";
import { colors, borderRadius, shadows, getProgressBarContainerStyle, getProgressBarFillStyle } from "@/lib/design-tokens";
import { PiggyBank } from "lucide-react";
import { PageTitle, PageContent } from "../page-layout";

export function WalletView() {
  const [showAddSavings, setShowAddSavings] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsNote, setSavingsNote] = useState('');
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentTitle, setPaymentTitle] = useState('');
  const [paymentPaidBy, setPaymentPaidBy] = useState('me');
  const [paymentSplit, setPaymentSplit] = useState('everyone');
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [paymentType, setPaymentType] = useState<'task' | 'oneoff'>('task');
  const [linkedTask, setLinkedTask] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'paid' | 'unsettled'>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 2500);
  };

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
              <button style={s.btn} onClick={() => setShowAddSavings(true)}>Add to savings</button>
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
            { label: 'Recorded', val: `$${totalRecorded}`, filter: 'all' as const },
            { label: 'Paid', val: `$${sharedPayments.filter(p => p.settled).reduce((s, p) => s + p.total, 0)}`, color: colors.success, filter: 'paid' as const },
            { label: 'Still owed', val: `$${sharedPayments.filter(p => !p.settled).reduce((s, p) => s + (p.unsettled?.reduce((a, b) => a + b.amount, 0) || p.youOwe || 0), 0)}`, color: '#D98E4F', filter: 'unsettled' as const },
          ].map(item => (
            <div key={item.label} onClick={() => setActiveFilter(item.filter)} style={{ ...s.card, padding: '12px 16px', cursor: 'pointer', outline: activeFilter === item.filter ? '2px solid #3D5C50' : 'none' }}>
              <div style={s.metaLabel}>{item.label}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: item.color || colors.textPrimary }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* Expense cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
          {sharedPayments
            .filter(p => {
              if (activeFilter === 'paid') return p.settled;
              if (activeFilter === 'unsettled') return !p.settled;
              return true;
            })
            .map(payment => (
            <div key={payment.id} style={{ ...s.card, cursor: 'pointer' }}>
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
            <button style={{ ...s.btn, width: 'auto', padding: '11px 24px' }} onClick={() => setShowAddSavings(true)}>Add to savings</button>
            <button style={s.btnSec} onClick={() => setShowRecordPayment(true)}>Record payment</button>
            <button style={s.btnSec} onClick={() => setShowSettleUp(true)}>Settle up</button>
          </div>
        </div>
      </PageContent>

      {successMessage && (
        <div style={{
          position: 'fixed', bottom: '90px', left: '50%',
          transform: 'translateX(-50%)',
          background: '#1F1F1F', color: '#fff',
          padding: '12px 20px', borderRadius: '12px',
          fontSize: '13px', fontWeight: 500,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          zIndex: 200, whiteSpace: 'nowrap',
        }}>
          {successMessage}
        </div>
      )}

      {showAddSavings && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 100,
          paddingBottom: '0',
        }} onClick={() => setShowAddSavings(false)}>
          <div style={{
            background: '#FFFCF8', borderRadius: '20px 20px 0 0',
            padding: '28px 24px max(40px, env(safe-area-inset-bottom, 40px))', width: '100%', maxWidth: '480px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
            paddingBottom: '80px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '36px', height: '4px', background: '#E6DED3', borderRadius: '99px', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1F1F1F', marginBottom: '4px' }}>Add to savings</h2>
            <p style={{ fontSize: '13px', color: '#8A847C', marginBottom: '24px' }}>This goes toward your personal Trip Fund.</p>
            <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6F6A63', display: 'block', marginBottom: '6px' }}>Amount</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E6DED3', borderRadius: '10px', background: '#F5F2EC', marginBottom: '16px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', fontSize: '16px', color: '#8A847C', borderRight: '1px solid #E6DED3' }}>$</span>
              <input
                type="number"
                placeholder="0.00"
                value={savingsAmount}
                onChange={e => setSavingsAmount(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '16px', background: 'transparent', border: 'none', outline: 'none', color: '#1F1F1F' }}
              />
            </div>
            <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6F6A63', display: 'block', marginBottom: '6px' }}>Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Weekly savings"
              value={savingsNote}
              onChange={e => setSavingsNote(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', background: '#F5F2EC', border: '1px solid #E6DED3', borderRadius: '10px', outline: 'none', color: '#1F1F1F', marginBottom: '24px', boxSizing: 'border-box' }}
            />
            <button
              onClick={() => {
                if (savingsAmount && parseFloat(savingsAmount) > 0) {
                  showSuccess(`Added $${savingsAmount} to your Trip Fund`);
                  setSavingsAmount('');
                  setSavingsNote('');
                  setShowAddSavings(false);
                }
              }}
              style={{ width: '100%', padding: '13px', background: '#3D5C50', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginBottom: '12px', fontFamily: 'inherit' }}
            >
              Add to Trip Fund
            </button>
            <button
              onClick={() => setShowAddSavings(false)}
              style={{ width: '100%', padding: '13px', background: 'transparent', color: '#8A847C', border: 'none', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showRecordPayment && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 100,
          paddingBottom: '0',
        }} onClick={() => setShowRecordPayment(false)}>
          <div style={{
            background: '#FFFCF8', borderRadius: '20px 20px 0 0',
            padding: '28px 24px max(40px, env(safe-area-inset-bottom, 40px))', width: '100%', maxWidth: '480px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
            maxHeight: '90vh', overflowY: 'auto',
            paddingBottom: '80px',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '36px', height: '4px', background: '#E6DED3', borderRadius: '99px', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1F1F1F', marginBottom: '4px' }}>Record payment</h2>
            <p style={{ fontSize: '13px', color: '#8A847C', marginBottom: '24px' }}>Log a shared expense and split it with the group.</p>

            {/* Payment type toggle */}
            <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6F6A63', display: 'block', marginBottom: '8px' }}>
              What are you recording?
            </label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {(['task', 'oneoff'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  style={{
                    flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid',
                    borderColor: paymentType === type ? '#2F6F5A' : '#E6DED3',
                    background: paymentType === type ? '#E3EFE9' : '#F5F2EC',
                    color: paymentType === type ? '#2F6F5A' : '#6F6A63',
                    fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  {type === 'task' ? 'Existing task' : 'One-off expense'}
                </button>
              ))}
            </div>

            {paymentType === 'task' ? (
              <>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6F6A63', display: 'block', marginBottom: '6px' }}>
                  Select task
                </label>
                <select
                  value={linkedTask}
                  onChange={e => setLinkedTask(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px', background: '#F5F2EC', border: '1px solid #E6DED3', borderRadius: '10px', outline: 'none', color: linkedTask ? '#1F1F1F' : '#8A847C', marginBottom: '16px', boxSizing: 'border-box' as const }}
                >
                  <option value="">Select a task...</option>
                  <option value="villa-deposit">Villa deposit</option>
                  <option value="group-dinner">Group dinner</option>
                  <option value="snorkeling-tour">Snorkeling tour</option>
                  <option value="travel-insurance">Travel insurance</option>
                  <option value="flights">Flights</option>
                  <option value="hotel">Hotel</option>
                </select>
              </>
            ) : (
              <>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6F6A63', display: 'block', marginBottom: '6px' }}>
                  Expense name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Airport snacks, Cab from hotel"
                  value={paymentTitle}
                  onChange={e => setPaymentTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '14px', background: '#F5F2EC', border: '1px solid #E6DED3', borderRadius: '10px', outline: 'none', color: '#1F1F1F', marginBottom: '16px', boxSizing: 'border-box' as const }}
                />
              </>
            )}

            <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6F6A63', display: 'block', marginBottom: '6px' }}>Amount</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E6DED3', borderRadius: '10px', background: '#F5F2EC', marginBottom: '16px', overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', fontSize: '16px', color: '#8A847C', borderRight: '1px solid #E6DED3' }}>$</span>
              <input
                type="number"
                placeholder="0.00"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '16px', background: 'transparent', border: 'none', outline: 'none', color: '#1F1F1F' }}
              />
            </div>

            <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6F6A63', display: 'block', marginBottom: '6px' }}>Who paid?</label>
            <select
              value={paymentPaidBy}
              onChange={e => setPaymentPaidBy(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', background: '#F5F2EC', border: '1px solid #E6DED3', borderRadius: '10px', outline: 'none', color: '#1F1F1F', marginBottom: '16px', boxSizing: 'border-box' as const }}
            >
              <option value="me">Me</option>
              <option value="mom">Mom</option>
              <option value="son">Son</option>
              <option value="tasha">Tasha</option>
            </select>

            <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#6F6A63', display: 'block', marginBottom: '6px' }}>Who did this cover?</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {[
                { value: 'everyone', label: 'Everyone in the group' },
                { value: 'me', label: 'Just me' },
                { value: 'custom', label: 'Custom split' },
              ].map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: paymentSplit === opt.value ? '#E3EFE9' : '#F5F2EC', border: `1px solid ${paymentSplit === opt.value ? '#2F6F5A' : '#E6DED3'}`, borderRadius: '10px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="split"
                    value={opt.value}
                    checked={paymentSplit === opt.value}
                    onChange={() => setPaymentSplit(opt.value)}
                    style={{ accentColor: '#2F6F5A' }}
                  />
                  <span style={{ fontSize: '14px', color: '#1F1F1F' }}>{opt.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => {
                const label = paymentType === 'task'
                  ? linkedTask.replace(/-/g, ' ')
                  : paymentTitle;
                if (label && paymentAmount && parseFloat(paymentAmount) > 0) {
                  showSuccess(`Payment recorded`);
                  setPaymentTitle('');
                  setPaymentAmount('');
                  setPaymentPaidBy('me');
                  setPaymentSplit('everyone');
                  setPaymentType('task');
                  setLinkedTask('');
                  setShowRecordPayment(false);
                }
              }}
              style={{ width: '100%', padding: '13px', background: '#3D5C50', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', marginBottom: '12px', fontFamily: 'inherit' }}
            >
              Record payment
            </button>
            <button
              onClick={() => setShowRecordPayment(false)}
              style={{ width: '100%', padding: '13px', background: 'transparent', color: '#8A847C', border: 'none', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSettleUp && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 100,
        }} onClick={() => setShowSettleUp(false)}>
          <div style={{
            background: '#FFFCF8', borderRadius: '20px 20px 0 0',
            padding: '28px 24px 80px', width: '100%', maxWidth: '480px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
            maxHeight: '90vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '36px', height: '4px', background: '#E6DED3', borderRadius: '99px', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1F1F1F', marginBottom: '4px' }}>Settle up</h2>
            <p style={{ fontSize: '13px', color: '#8A847C', marginBottom: '24px' }}>Resolve outstanding balances with your group.</p>

            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6F6A63', marginBottom: '10px' }}>
              Owes you
            </div>
            {[
              { name: 'Mom', amount: 40 },
              { name: 'Son', amount: 100 },
              { name: 'Dad', amount: 100 },
            ].map(person => (
              <div key={person.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid #E6DED3',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F1F1F' }}>{person.name}</div>
                  <div style={{ fontSize: '12px', color: '#8A847C' }}>owes you ${person.amount}</div>
                </div>
                <button
                  onClick={() => showSuccess(`${person.name} marked as settled`)}
                  style={{ padding: '7px 16px', background: '#E3EFE9', color: '#2F6F5A', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Mark paid
                </button>
              </div>
            ))}

            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6F6A63', margin: '20px 0 10px' }}>
              You owe
            </div>
            {[
              { name: 'Tasha', amount: 35 },
            ].map(person => (
              <div key={person.name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', borderBottom: '1px solid #E6DED3',
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F1F1F' }}>{person.name}</div>
                  <div style={{ fontSize: '12px', color: '#8A847C' }}>you owe ${person.amount}</div>
                </div>
                <button
                  onClick={() => showSuccess(`Payment to ${person.name} recorded`)}
                  style={{ padding: '7px 16px', background: '#F6E7D8', color: '#8B4F1A', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Record payment
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowSettleUp(false)}
              style={{ width: '100%', padding: '13px', background: 'transparent', color: '#8A847C', border: 'none', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '24px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
