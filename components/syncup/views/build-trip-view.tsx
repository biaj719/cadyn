"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ClipboardCheck, Sparkles, Calculator, Plus, Pencil } from "lucide-react";
import { mockTrip } from "@/lib/mock-data";
import { 
  colors, 
  typography, 
  spacing, 
  borderRadius, 
  shadows,
  sectionHeaderStyles,
} from "@/lib/design-tokens";

interface BuildTripViewProps {
  onBack: () => void;
  isOrganizer?: boolean;
}

interface RequiredItem {
  id: string;
  name: string;
  cost: number;
  dueDate: string;
}

interface Experience {
  id: string;
  name: string;
  description: string;
  cost: number;
  rsvpDate: string;
}

export function BuildTripView({ onBack, isOrganizer = true }: BuildTripViewProps) {
  const [tripName, setTripName] = useState(mockTrip.name);
  const [destination, setDestination] = useState(mockTrip.destination);
  const [startDate, setStartDate] = useState(mockTrip.startDate);
  const [endDate, setEndDate] = useState(mockTrip.endDate);

  const [requiredItems, setRequiredItems] = useState<RequiredItem[]>([
    { id: "1", name: "Book flights", cost: 800, dueDate: "2026-04-20" },
    { id: "2", name: "Book hotel", cost: 500, dueDate: "2026-04-20" },
    { id: "3", name: "Get travel insurance", cost: 150, dueDate: "2026-04-15" },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", name: "Snorkeling tour", description: "Guided reef exploration", cost: 120, rsvpDate: "2026-04-25" },
    { id: "2", name: "Sunset dinner cruise", description: "Evening ocean dining experience", cost: 200, rsvpDate: "2026-04-26" },
  ]);

  // Inline creation states
  const [expandedRequiredItemForm, setExpandedRequiredItemForm] = useState(false);
  const [newRequiredItem, setNewRequiredItem] = useState({ name: "", cost: "", dueDate: "" });
  
  const [expandedExperienceForm, setExpandedExperienceForm] = useState(false);
  const [newExperience, setNewExperience] = useState({ name: "", description: "", cost: "", rsvpDate: "" });

  const essentialsTotal = requiredItems.reduce((sum, item) => sum + item.cost, 0);
  const experiencesTotal = experiences.reduce((sum, item) => sum + item.cost, 0);

  // Add required item handler
  const handleAddRequiredItem = () => {
    if (!newRequiredItem.name.trim() || !newRequiredItem.cost) {
      return;
    }
    const item: RequiredItem = {
      id: Date.now().toString(),
      name: newRequiredItem.name,
      cost: parseFloat(newRequiredItem.cost as string),
      dueDate: newRequiredItem.dueDate || new Date().toISOString().split('T')[0],
    };
    setRequiredItems([...requiredItems, item]);
    setNewRequiredItem({ name: "", cost: "", dueDate: "" });
    setExpandedRequiredItemForm(false);
  };

  // Add experience handler
  const handleAddExperience = () => {
    if (!newExperience.name.trim() || !newExperience.cost) {
      return;
    }
    const exp: Experience = {
      id: Date.now().toString(),
      name: newExperience.name,
      description: newExperience.description,
      cost: parseFloat(newExperience.cost as string),
      rsvpDate: newExperience.rsvpDate || new Date().toISOString().split('T')[0],
    };
    setExperiences([...experiences, exp]);
    setNewExperience({ name: "", description: "", cost: "", rsvpDate: "" });
    setExpandedExperienceForm(false);
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      {/* Header with back button */}
      <div
        style={{
          padding: `${spacing['6']} 0`,
          borderBottom: `1px solid ${colors.border}`,
          backgroundColor: colors.background,
        }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div style={{ display: "flex", alignItems: "center", gap: spacing['4'], marginBottom: spacing['4'] }}>
          <button
            onClick={onBack}
            className="hover:bg-muted/50 p-2 rounded transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </button>
          <div>
            <h1 style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
            }}>
              Build Trip
            </h1>
            <p style={{
              fontSize: typography.fontSize.base,
              color: colors.textMuted,
              marginTop: spacing['1'],
            }}>
              Set up your trip structure and plan group experiences
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          paddingTop: spacing['9'],
          paddingBottom: spacing['12'],
        }}
      >
        <p style={{ fontSize: '13px', color: '#8A847C', marginBottom: '20px' }}>
          These tasks define what your group needs to complete before the trip.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: spacing['12'] }}>
          {/* TRIP BASICS */}
          <section>
            <div style={{
              fontSize: sectionHeaderStyles.fontSize,
              fontWeight: sectionHeaderStyles.fontWeight,
              letterSpacing: sectionHeaderStyles.letterSpacing,
              textTransform: sectionHeaderStyles.textTransform,
              color: sectionHeaderStyles.color,
              marginBottom: spacing['6'],
            }}>
              Trip Basics
            </div>

            <div style={{
              backgroundColor: colors.card,
              borderRadius: borderRadius['2xl'],
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.sm,
              overflow: "hidden",
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: spacing['6'],
                padding: spacing['8'],
              }}>
                <div>
                  <label style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['2'],
                  }}>
                    Trip Name
                  </label>
                  <input
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    disabled={!isOrganizer}
                    style={{
                      width: "100%",
                      padding: spacing['3'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.base,
                      color: colors.textPrimary,
                      backgroundColor: isOrganizer ? colors.card : colors.background,
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['2'],
                  }}>
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    disabled={!isOrganizer}
                    style={{
                      width: "100%",
                      padding: spacing['3'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.base,
                      color: colors.textPrimary,
                      backgroundColor: isOrganizer ? colors.card : colors.background,
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['2'],
                  }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={!isOrganizer}
                    style={{
                      width: "100%",
                      padding: spacing['3'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.base,
                      color: colors.textPrimary,
                      backgroundColor: isOrganizer ? colors.card : colors.background,
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['2'],
                  }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={!isOrganizer}
                    style={{
                      width: "100%",
                      padding: spacing['3'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.base,
                      color: colors.textPrimary,
                      backgroundColor: isOrganizer ? colors.card : colors.background,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* REQUIRED ITEMS (ESSENTIALS) */}
          <section>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: spacing['2'],
              marginBottom: spacing['6'],
            }}>
              <ClipboardCheck size={16} color={colors.textMuted} />
              <span style={{
                fontSize: sectionHeaderStyles.fontSize,
                fontWeight: sectionHeaderStyles.fontWeight,
                letterSpacing: sectionHeaderStyles.letterSpacing,
                textTransform: sectionHeaderStyles.textTransform,
                color: sectionHeaderStyles.color,
              }}>
                Required Items
              </span>
            </div>

            <div style={{
              backgroundColor: colors.card,
              borderRadius: borderRadius['2xl'],
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.sm,
              overflow: "hidden",
            }}>
              {requiredItems.length > 0 && (
                <div>
                  {requiredItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: spacing['6'],
                        borderBottom: index < requiredItems.length - 1 ? `1px solid ${colors.border}` : "none",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.textPrimary,
                        }}>
                          {item.name}
                        </p>
                        <div style={{
                          display: "flex",
                          gap: spacing['4'],
                          marginTop: spacing['2'],
                          fontSize: typography.fontSize.sm,
                          color: colors.textMuted,
                        }}>
                          <span>${item.cost}</span>
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        style={{
                          padding: spacing['2'],
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Pencil size={16} color={colors.textMuted} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{
                padding: spacing['6'],
                borderTop: requiredItems.length > 0 ? `1px solid ${colors.border}` : "none",
              }}>
                {!expandedRequiredItemForm ? (
                  <button
                    onClick={() => setExpandedRequiredItemForm(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: spacing['2'],
                      fontSize: typography.fontSize.base,
                      color: colors.success,
                      cursor: "pointer",
                      border: "none",
                      background: "none",
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    <Plus size={16} />
                    Add required item
                  </button>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto auto", gap: spacing['3'], alignItems: "flex-end" }}>
                    <div>
                      <label style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.textMuted,
                        display: "block",
                        marginBottom: spacing['1'],
                      }}>
                        Item name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Book flights"
                        value={newRequiredItem.name}
                        onChange={(e) => setNewRequiredItem({ ...newRequiredItem, name: e.target.value })}
                        style={{
                          width: "100%",
                          padding: spacing['2'],
                          borderRadius: borderRadius.md,
                          border: `1px solid ${colors.border}`,
                          fontSize: typography.fontSize.sm,
                          fontFamily: "inherit",
                          backgroundColor: colors.background,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.textMuted,
                        display: "block",
                        marginBottom: spacing['1'],
                      }}>
                        Cost
                      </label>
                      <input
                        type="number"
                        placeholder="$"
                        value={newRequiredItem.cost}
                        onChange={(e) => setNewRequiredItem({ ...newRequiredItem, cost: e.target.value })}
                        style={{
                          width: "100%",
                          padding: spacing['2'],
                          borderRadius: borderRadius.md,
                          border: `1px solid ${colors.border}`,
                          fontSize: typography.fontSize.sm,
                          fontFamily: "inherit",
                          backgroundColor: colors.background,
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.textMuted,
                        display: "block",
                        marginBottom: spacing['1'],
                      }}>
                        Due date
                      </label>
                      <input
                        type="date"
                        value={newRequiredItem.dueDate}
                        onChange={(e) => setNewRequiredItem({ ...newRequiredItem, dueDate: e.target.value })}
                        style={{
                          width: "100%",
                          padding: spacing['2'],
                          borderRadius: borderRadius.md,
                          border: `1px solid ${colors.border}`,
                          fontSize: typography.fontSize.sm,
                          fontFamily: "inherit",
                          backgroundColor: colors.background,
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleAddRequiredItem}
                      disabled={!newRequiredItem.name.trim() || !newRequiredItem.cost}
                      size="sm"
                      className="h-8"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setExpandedRequiredItemForm(false);
                        setNewRequiredItem({ name: "", cost: "", dueDate: "" });
                      }}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* EXPERIENCES (FOCAL POINT) */}
          <section>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: spacing['2'],
              marginBottom: spacing['6'],
            }}>
              <Sparkles size={16} color={colors.textMuted} />
              <span style={{
                fontSize: sectionHeaderStyles.fontSize,
                fontWeight: sectionHeaderStyles.fontWeight,
                letterSpacing: sectionHeaderStyles.letterSpacing,
                textTransform: sectionHeaderStyles.textTransform,
                color: sectionHeaderStyles.color,
              }}>
                Experiences
              </span>
            </div>

            {experiences.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: spacing['6'],
                marginBottom: spacing['6'],
              }}>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: borderRadius['2xl'],
                      border: `1px solid ${colors.border}`,
                      boxShadow: shadows.sm,
                      padding: spacing['6'],
                      transition: "all 0.2s ease",
                    }}
                    className="hover:border-textMuted/30 hover:shadow-md"
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: spacing['4'],
                    }}>
                      <h3 style={{
                        fontSize: typography.fontSize.lg,
                        fontWeight: typography.fontWeight.semibold,
                        color: colors.textPrimary,
                      }}>
                        {exp.name}
                      </h3>
                      <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <Pencil size={16} color={colors.textMuted} />
                      </button>
                    </div>

                    <p style={{
                      fontSize: typography.fontSize.base,
                      color: colors.textMuted,
                      marginBottom: spacing['4'],
                      lineHeight: "1.5",
                    }}>
                      {exp.description}
                    </p>

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: spacing['4'],
                      borderTop: `1px solid ${colors.border}`,
                    }}>
                      <div>
                        <p style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginBottom: spacing['1'] }}>Cost</p>
                        <p style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary }}>
                          ${exp.cost}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: typography.fontSize.xs, color: colors.textMuted, marginBottom: spacing['1'] }}>RSVP by</p>
                        <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary }}>
                          {new Date(exp.rsvpDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!expandedExperienceForm && (
              <div style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius['2xl'],
                border: `2px dashed ${colors.border}`,
                boxShadow: shadows.sm,
                padding: spacing['6'],
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              className="hover:border-textMuted/50 hover:shadow-md"
              onClick={() => setExpandedExperienceForm(true)}
              >
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: spacing['2'],
                    fontSize: typography.fontSize.base,
                    color: colors.success,
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  <Plus size={16} />
                  Add experience
                </button>
              </div>
            )}

            {expandedExperienceForm && (
              <div style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius['2xl'],
                border: `1px solid ${colors.border}`,
                boxShadow: shadows.sm,
                padding: spacing['6'],
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: spacing['4'],
              }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['1'],
                  }}>
                    Experience name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Snorkeling tour"
                    value={newExperience.name}
                    onChange={(e) => setNewExperience({ ...newExperience, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: spacing['2'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.sm,
                      fontFamily: "inherit",
                      backgroundColor: colors.background,
                    }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['1'],
                  }}>
                    Description
                  </label>
                  <textarea
                    placeholder="What&apos;s this experience about?"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: spacing['2'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.sm,
                      fontFamily: "inherit",
                      backgroundColor: colors.background,
                      minHeight: "60px",
                      resize: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['1'],
                  }}>
                    Cost
                  </label>
                  <input
                    type="number"
                    placeholder="$"
                    value={newExperience.cost}
                    onChange={(e) => setNewExperience({ ...newExperience, cost: e.target.value })}
                    style={{
                      width: "100%",
                      padding: spacing['2'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.sm,
                      fontFamily: "inherit",
                      backgroundColor: colors.background,
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textMuted,
                    display: "block",
                    marginBottom: spacing['1'],
                  }}>
                    RSVP by date
                  </label>
                  <input
                    type="date"
                    value={newExperience.rsvpDate}
                    onChange={(e) => setNewExperience({ ...newExperience, rsvpDate: e.target.value })}
                    style={{
                      width: "100%",
                      padding: spacing['2'],
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.border}`,
                      fontSize: typography.fontSize.sm,
                      fontFamily: "inherit",
                      backgroundColor: colors.background,
                    }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: spacing['3'], justifyContent: "flex-end" }}>
                  <Button
                    onClick={handleAddExperience}
                    disabled={!newExperience.name.trim() || !newExperience.cost}
                    className="gap-2"
                    size="sm"
                  >
                    Save experience
                  </Button>
                  <Button
                    onClick={() => {
                      setExpandedExperienceForm(false);
                      setNewExperience({ name: "", description: "", cost: "", rsvpDate: "" });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </section>

          {/* ESTIMATED COSTS */}
          <section>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: spacing['2'],
              marginBottom: spacing['6'],
            }}>
              <Calculator size={16} color={colors.textMuted} />
              <span style={{
                fontSize: sectionHeaderStyles.fontSize,
                fontWeight: sectionHeaderStyles.fontWeight,
                letterSpacing: sectionHeaderStyles.letterSpacing,
                textTransform: sectionHeaderStyles.textTransform,
                color: sectionHeaderStyles.color,
              }}>
                Estimated Costs
              </span>
            </div>

            <div style={{
              backgroundColor: colors.card,
              borderRadius: borderRadius['2xl'],
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.sm,
              padding: spacing['8'],
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing['6'],
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: typography.fontSize.base,
                    color: colors.textMuted,
                  }}>
                    Essentials total
                  </span>
                  <span style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary,
                  }}>
                    ${essentialsTotal}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: typography.fontSize.base,
                    color: colors.textMuted,
                  }}>
                    Experiences total
                  </span>
                  <span style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary,
                  }}>
                    ${experiencesTotal}
                  </span>
                </div>

                <div style={{
                  borderTop: `1px solid ${colors.border}`,
                  paddingTop: spacing['6'],
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <span style={{
                    fontSize: typography.fontSize.base,
                    fontWeight: typography.fontWeight.semibold,
                    color: colors.textPrimary,
                  }}>
                    Combined estimate
                  </span>
                  <span style={{
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.success,
                  }}>
                    ${essentialsTotal + experiencesTotal}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div style={{
            display: "flex",
            gap: spacing['4'],
            justifyContent: "flex-end",
            paddingTop: spacing['8'],
            borderTop: `1px solid ${colors.border}`,
          }}>
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button onClick={onBack}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
