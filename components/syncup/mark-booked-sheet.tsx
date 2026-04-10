'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, GripHorizontal, Check } from 'lucide-react';
import { colors, typography, spacing, borderRadius, shadows } from '@/lib/design-tokens';
import { useIsMobile } from '@/hooks/use-mobile';

interface MarkBookedSheetProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemCost: number;
}

export function MarkBookedSheet({ isOpen, onClose, itemName, itemCost }: MarkBookedSheetProps) {
  const isMobile = useIsMobile();
  const [whoPaid, setWhoPaid] = useState('Dad (Williams household)');
  const [showWhoPaidDropdown, setShowWhoPaidDropdown] = useState(false);
  
  const [selectedInclusions, setSelectedInclusions] = useState({
    williams: true,
    grandma: true,
    chens: false,
    garcias: false,
  });

  const [splitMode, setSplitMode] = useState<'evenly' | 'custom'>('evenly');
  const [customAmounts, setCustomAmounts] = useState({
    grandma: '',
    williams: '',
  });

  if (!isOpen) return null;

  const handleInclusionToggle = (key: keyof typeof selectedInclusions) => {
    setSelectedInclusions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleConfirm = () => {
    console.log('Booking confirmed with:', {
      whoPaid,
      selectedInclusions,
      splitMode,
      customAmounts
    });
    onClose();
  };

  const InclusionRow = ({ 
    id, 
    name, 
    subtitle, 
    isSelected 
  }: { 
    id: keyof typeof selectedInclusions; 
    name: string; 
    subtitle: string; 
    isSelected: boolean;
  }) => (
    <button
      onClick={() => handleInclusionToggle(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing['3'],
        width: '100%',
        padding: spacing['4'],
        backgroundColor: isSelected ? colors.successLighter : colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.lg,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: spacing['2'],
      }}
      className="hover:border-textMuted/30"
    >
      {/* Checkbox */}
      <div
        style={{
          width: '20px',
          height: '20px',
          borderRadius: borderRadius.sm,
          border: `2px solid ${isSelected ? colors.success : colors.border}`,
          backgroundColor: isSelected ? colors.success : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </div>

      {/* Text */}
      <div style={{ textAlign: 'left', flex: 1 }}>
        <p
          style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.textPrimary,
            marginBottom: spacing['1'],
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontSize: typography.fontSize.sm,
            color: colors.textMuted,
          }}
        >
          {subtitle}
        </p>
      </div>
    </button>
  );

  // Mobile bottom sheet
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            transition: 'opacity 0.3s ease',
          }}
          onClick={onClose}
        />

        {/* Bottom Sheet */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: colors.card,
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -2px 16px rgba(0, 0, 0, 0.1)',
            animation: 'slideUp 0.3s ease-out',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>

          {/* Drag Handle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: spacing['2'],
              paddingBottom: spacing['2'],
            }}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: borderRadius.full,
                backgroundColor: colors.textMuted,
                opacity: 0.3,
              }}
            />
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              paddingLeft: spacing['6'],
              paddingRight: spacing['6'],
              paddingTop: spacing['2'],
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: spacing['6'] }}>
              <h2
                style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.textPrimary,
                  marginBottom: spacing['1'],
                }}
              >
                Mark as booked
              </h2>
              <p
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.textMuted,
                }}
              >
                {itemName} • ${itemCost.toLocaleString()}
              </p>
            </div>

            {/* Section 1: Who Paid */}
            <div style={{ marginBottom: spacing['6'] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textMuted,
                  marginBottom: spacing['2'],
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Who paid?
              </label>
              <button
                onClick={() => setShowWhoPaidDropdown(!showWhoPaidDropdown)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${spacing['3']} ${spacing['4']}`,
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.border}`,
                  borderRadius: borderRadius.lg,
                  fontSize: typography.fontSize.base,
                  color: colors.textPrimary,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="hover:border-textMuted/30"
              >
                <span>{whoPaid}</span>
                <ChevronDown
                  size={16}
                  color={colors.textMuted}
                  style={{
                    transform: showWhoPaidDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>
            </div>

            {/* Section 2: Who's Included */}
            <div style={{ marginBottom: spacing['6'] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textMuted,
                  marginBottom: spacing['3'],
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Who&apos;s included?
              </label>
              <InclusionRow
                id="williams"
                name="Williams household"
                subtitle="You, partner, 2 kids"
                isSelected={selectedInclusions.williams}
              />
              <InclusionRow
                id="grandma"
                name="Grandma"
                subtitle="Traveling with you"
                isSelected={selectedInclusions.grandma}
              />
              <InclusionRow
                id="chens"
                name="The Chens"
                subtitle=""
                isSelected={selectedInclusions.chens}
              />
              <InclusionRow
                id="garcias"
                name="The Garcias"
                subtitle=""
                isSelected={selectedInclusions.garcias}
              />
            </div>

            {/* Section 3: Split */}
            <div style={{ marginBottom: spacing['8'] }}>
              <label
                style={{
                  display: 'block',
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.textMuted,
                  marginBottom: spacing['3'],
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Split
              </label>

              {/* Radio Option 1: Evenly */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing['3'],
                  padding: spacing['3'],
                  marginBottom: spacing['2'],
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="split-mode"
                  value="evenly"
                  checked={splitMode === 'evenly'}
                  onChange={() => setSplitMode('evenly')}
                  style={{
                    cursor: 'pointer',
                    accentColor: colors.success,
                  }}
                />
                <span
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.textPrimary,
                    fontWeight: splitMode === 'evenly' ? typography.fontWeight.semibold : typography.fontWeight.normal,
                  }}
                >
                  Split evenly
                </span>
              </label>

              {/* Radio Option 2: Custom */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing['3'],
                  padding: spacing['3'],
                  marginBottom: spacing['3'],
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="split-mode"
                  value="custom"
                  checked={splitMode === 'custom'}
                  onChange={() => setSplitMode('custom')}
                  style={{
                    cursor: 'pointer',
                    accentColor: colors.success,
                  }}
                />
                <span
                  style={{
                    fontSize: typography.fontSize.base,
                    color: colors.textPrimary,
                    fontWeight: splitMode === 'custom' ? typography.fontWeight.semibold : typography.fontWeight.normal,
                  }}
                >
                  Custom amounts
                </span>
              </label>

              {/* Custom Amount Inputs */}
              {splitMode === 'custom' && (
                <div
                  style={{
                    backgroundColor: colors.background,
                    borderRadius: borderRadius.lg,
                    padding: spacing['4'],
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: spacing['3'],
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.textMuted,
                        display: 'block',
                        marginBottom: spacing['1'],
                      }}
                    >
                      Grandma
                    </label>
                    <input
                      type="number"
                      placeholder="$"
                      value={customAmounts.grandma}
                      onChange={(e) => setCustomAmounts(prev => ({ ...prev, grandma: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: spacing['2'],
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.base,
                        backgroundColor: colors.card,
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.textMuted,
                        display: 'block',
                        marginBottom: spacing['1'],
                      }}
                    >
                      Williams
                    </label>
                    <input
                      type="number"
                      placeholder="$"
                      value={customAmounts.williams}
                      onChange={(e) => setCustomAmounts(prev => ({ ...prev, williams: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: spacing['2'],
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        fontSize: typography.fontSize.base,
                        backgroundColor: colors.card,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div
            style={{
              paddingLeft: spacing['6'],
              paddingRight: spacing['6'],
              paddingTop: spacing['4'],
              paddingBottom: spacing['6'],
              borderTop: `1px solid ${colors.border}`,
              backgroundColor: colors.card,
              display: 'flex',
              gap: spacing['3'],
            }}
          >
            <Button
              onClick={onClose}
              variant="outline"
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              style={{ flex: 1 }}
            >
              Confirm booking
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Desktop version - centered modal
  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 40,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          backgroundColor: colors.card,
          borderRadius: borderRadius['2xl'],
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.lg,
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: spacing['6'],
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: spacing['6'] }}>
            <h2
              style={{
                fontSize: typography.fontSize['2xl'],
                fontWeight: typography.fontWeight.bold,
                color: colors.textPrimary,
                marginBottom: spacing['1'],
              }}
            >
              Mark as booked
            </h2>
            <p
              style={{
                fontSize: typography.fontSize.base,
                color: colors.textMuted,
              }}
            >
              {itemName} • ${itemCost.toLocaleString()}
            </p>
          </div>

          {/* Section 1: Who Paid */}
          <div style={{ marginBottom: spacing['6'] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textMuted,
                marginBottom: spacing['2'],
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Who paid?
            </label>
            <button
              onClick={() => setShowWhoPaidDropdown(!showWhoPaidDropdown)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: `${spacing['3']} ${spacing['4']}`,
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: borderRadius.lg,
                fontSize: typography.fontSize.base,
                color: colors.textPrimary,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              className="hover:border-textMuted/30"
            >
              <span>{whoPaid}</span>
              <ChevronDown
                size={16}
                color={colors.textMuted}
                style={{
                  transform: showWhoPaidDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>

          {/* Section 2: Who's Included */}
          <div style={{ marginBottom: spacing['6'] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textMuted,
                marginBottom: spacing['3'],
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Who&apos;s included?
            </label>
            <InclusionRow
              id="williams"
              name="Williams household"
              subtitle="You, partner, 2 kids"
              isSelected={selectedInclusions.williams}
            />
            <InclusionRow
              id="grandma"
              name="Grandma"
              subtitle="Traveling with you"
              isSelected={selectedInclusions.grandma}
            />
            <InclusionRow
              id="chens"
              name="The Chens"
              subtitle=""
              isSelected={selectedInclusions.chens}
            />
            <InclusionRow
              id="garcias"
              name="The Garcias"
              subtitle=""
              isSelected={selectedInclusions.garcias}
            />
          </div>

          {/* Section 3: Split */}
          <div style={{ marginBottom: spacing['3'] }}>
            <label
              style={{
                display: 'block',
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.semibold,
                color: colors.textMuted,
                marginBottom: spacing['3'],
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Split
            </label>

            {/* Radio Option 1: Evenly */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing['3'],
                padding: spacing['3'],
                marginBottom: spacing['2'],
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="split-mode"
                value="evenly"
                checked={splitMode === 'evenly'}
                onChange={() => setSplitMode('evenly')}
                style={{
                  cursor: 'pointer',
                  accentColor: colors.success,
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.textPrimary,
                  fontWeight: splitMode === 'evenly' ? typography.fontWeight.semibold : typography.fontWeight.normal,
                }}
              >
                Split evenly
              </span>
            </label>

            {/* Radio Option 2: Custom */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing['3'],
                padding: spacing['3'],
                marginBottom: spacing['3'],
                cursor: 'pointer',
              }}
            >
              <input
                type="radio"
                name="split-mode"
                value="custom"
                checked={splitMode === 'custom'}
                onChange={() => setSplitMode('custom')}
                style={{
                  cursor: 'pointer',
                  accentColor: colors.success,
                }}
              />
              <span
                style={{
                  fontSize: typography.fontSize.base,
                  color: colors.textPrimary,
                  fontWeight: splitMode === 'custom' ? typography.fontWeight.semibold : typography.fontWeight.normal,
                }}
              >
                Custom amounts
              </span>
            </label>

            {/* Custom Amount Inputs */}
            {splitMode === 'custom' && (
              <div
                style={{
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.lg,
                  padding: spacing['4'],
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: spacing['3'],
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.textMuted,
                      display: 'block',
                      marginBottom: spacing['1'],
                    }}
                  >
                    Grandma
                  </label>
                  <input
                    type="number"
                    placeholder="$"
                    value={customAmounts.grandma}
                    onChange={(e) => setCustomAmounts(prev => ({ ...prev, grandma: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: spacing['2'],
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.base,
                      backgroundColor: colors.card,
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.textMuted,
                      display: 'block',
                      marginBottom: spacing['1'],
                    }}
                  >
                    Williams
                  </label>
                  <input
                    type="number"
                    placeholder="$"
                    value={customAmounts.williams}
                    onChange={(e) => setCustomAmounts(prev => ({ ...prev, williams: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: spacing['2'],
                      border: `1px solid ${colors.border}`,
                      borderRadius: borderRadius.md,
                      fontSize: typography.fontSize.base,
                      backgroundColor: colors.card,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Footer */}
        <div
          style={{
            paddingLeft: spacing['6'],
            paddingRight: spacing['6'],
            paddingTop: spacing['4'],
            paddingBottom: spacing['6'],
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.card,
            display: 'flex',
            gap: spacing['3'],
          }}
        >
          <Button
            onClick={onClose}
            variant="outline"
            style={{ flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            style={{ flex: 1 }}
          >
            Confirm booking
          </Button>
        </div>
      </div>
    </>
  );
}
