"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { CadynLogo } from "@/components/cadyn-logo";
import { Plane, BedDouble, Shield, Sparkles, ArrowRight } from "lucide-react";

type Step = "signup" | "signin" | "choice" | "create-details" | "join-code" | "join-preview";
type Role = "organizer" | "attendee";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("signup");
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    if (step === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account, then come back to sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else setStep("choice");
    }
    setLoading(false);
  };

  const handleRoleChoice = (chosen: Role) => {
    setRole(chosen);
    if (chosen === "organizer") setStep("create-details");
    else setStep("join-code");
  };

  const handleComplete = (chosenRole: Role) => {
    localStorage.setItem("cadyn_role", chosenRole);
    localStorage.setItem("cadyn_onboarding_complete", "true");
    localStorage.setItem("cadyn_onboarding_version", "v2");
    window.location.href = "/";
  };

  const s = {
    page: { minHeight: "100vh", background: "#F5F2EC", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" } as React.CSSProperties,
    card: { background: "#FFFCF8", border: "1px solid #E6DED3", borderRadius: "16px", padding: "32px 28px", width: "100%", maxWidth: "400px" } as React.CSSProperties,
    label: { fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: "#6F6A63", display: "block", marginBottom: "6px" },
    input: { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #E6DED3", fontSize: "14px", background: "#F5F2EC", color: "#1F1F1F", outline: "none", boxSizing: "border-box" as const },
    btn: { width: "100%", padding: "12px", background: "#3D5C50", color: "#fff", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: "8px" } as React.CSSProperties,
    btnSec: { width: "100%", padding: "12px", background: "#EAE4DC", color: "#2E2A26", border: "1px solid #D8CFC5", borderRadius: "12px", fontSize: "15px", fontWeight: 500, cursor: "pointer", fontFamily: "inherit", marginTop: "8px" } as React.CSSProperties,
    title: { fontSize: "22px", fontWeight: 700, color: "#1F1F1F", marginBottom: "6px" },
    sub: { fontSize: "13px", color: "#8A847C", marginBottom: "24px", lineHeight: 1.5 },
    error: { fontSize: "13px", color: "#C0392B", marginBottom: "12px" },
    success: { fontSize: "13px", color: "#2F6F5A", marginBottom: "12px" },
    choiceCard: (selected: boolean) => ({
      background: selected ? "#F0F7F4" : "#FFFCF8",
      border: `2px solid ${selected ? "#C8DDD4" : "#E6DED3"}`,
      borderRadius: "12px", padding: "16px", cursor: "pointer", marginBottom: "10px",
      display: "flex", alignItems: "center", gap: "14px",
    } as React.CSSProperties),
    choiceIcon: (color: string) => ({ width: "40px", height: "40px", background: color, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "20px" } as React.CSSProperties),
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "center" }}>
          <CadynLogo />
        </div>

        {/* SIGN UP */}
        {step === "signup" && (
          <>
            <div style={s.title}>Create your account</div>
            <div style={s.sub}>Start coordinating your group travel.</div>
            <label style={s.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...s.input, marginBottom: "14px" }} />
            <label style={s.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...s.input, marginBottom: "16px" }} />
            {error && <div style={s.error}>{error}</div>}
            {message && <div style={s.success}>{message}</div>}
            <button style={s.btn} onClick={handleAuth} disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
            <p style={{ fontSize: "13px", color: "#8A847C", textAlign: "center", marginTop: "16px" }}>
              Already have an account?{" "}
              <button onClick={() => setStep("signin")} style={{ color: "#3D5C50", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Sign in</button>
            </p>
          </>
        )}

        {/* SIGN IN */}
        {step === "signin" && (
          <>
            <div style={s.title}>Welcome back</div>
            <div style={s.sub}>Sign in to continue to Cadyn.</div>
            <label style={s.label}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ ...s.input, marginBottom: "14px" }} />
            <label style={s.label}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...s.input, marginBottom: "16px" }} />
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={handleAuth} disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
            <p style={{ fontSize: "13px", color: "#8A847C", textAlign: "center", marginTop: "16px" }}>
              Don't have an account?{" "}
              <button onClick={() => setStep("signup")} style={{ color: "#3D5C50", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Sign up</button>
            </p>
          </>
        )}

        {/* CHOICE */}
        {step === "choice" && (
          <>
            <div style={s.title}>What brings you here?</div>
            <div style={s.sub}>We'll personalize your experience based on your role.</div>
            <div style={s.choiceCard(role === "organizer")} onClick={() => handleRoleChoice("organizer")}>
              <div style={s.choiceIcon("#D0E8DF")}><Sparkles size={20} color="#2F6F5A" /></div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#1F1F1F" }}>Create a trip</div>
                <div style={{ fontSize: "12px", color: "#4A7A62", marginTop: "2px" }}>I'm organizing the group</div>
              </div>
            </div>
            <div style={s.choiceCard(role === "attendee")} onClick={() => handleRoleChoice("attendee")}>
              <div style={s.choiceIcon("#EFE9E0")}><ArrowRight size={20} color="#6F6A63" /></div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#1F1F1F" }}>Join a trip</div>
                <div style={{ fontSize: "12px", color: "#8A847C", marginTop: "2px" }}>I have a join code</div>
              </div>
            </div>
          </>
        )}

        {/* CREATE DETAILS */}
        {step === "create-details" && (
          <>
            <div style={s.title}>Name your trip</div>
            <div style={s.sub}>Just the basics for now — you can add more later.</div>
            <label style={s.label}>Trip name</label>
            <input type="text" placeholder="e.g. Cabo Trip 2026" style={{ ...s.input, marginBottom: "14px" }} />
            <label style={s.label}>Destination</label>
            <input type="text" placeholder="e.g. Cabo San Lucas, Mexico" style={{ ...s.input, marginBottom: "14px" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div>
                <label style={s.label}>Start date</label>
                <input type="date" style={s.input} />
              </div>
              <div>
                <label style={s.label}>End date</label>
                <input type="date" style={s.input} />
              </div>
            </div>
            <button style={s.btn} onClick={() => handleComplete("organizer")}>Go to my trip →</button>
            <button style={s.btnSec} onClick={() => setStep("choice")}>← Back</button>
          </>
        )}

        {/* JOIN CODE */}
        {step === "join-code" && (
          <>
            <div style={s.title}>Join a trip</div>
            <div style={s.sub}>Enter the code your organizer shared with you.</div>
            <div style={{ background: "#F0F7F4", border: "2px dashed #C8DDD4", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#4A7A62", marginBottom: "10px" }}>Join code</div>
              <input
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. CABO26"
                style={{ background: "transparent", border: "none", outline: "none", fontSize: "26px", fontWeight: 700, letterSpacing: "0.15em", color: "#1E4A38", textAlign: "center", width: "100%", fontFamily: "inherit" }}
              />
            </div>
            <button style={s.btn} onClick={() => setStep("join-preview")}>Find trip →</button>
            <button style={s.btnSec} onClick={() => setStep("choice")}>← Back</button>
          </>
        )}

        {/* JOIN PREVIEW */}
        {step === "join-preview" && (
          <>
            <div style={s.title}>You're invited</div>
            <div style={s.sub}>Here's what you're joining.</div>
            <div style={{ background: "linear-gradient(135deg, #DDE8E2, #EAF3EE)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#1E4A38", marginBottom: "3px" }}>Cabo Trip 2026 🌊</div>
              <div style={{ fontSize: "12px", color: "#4A7A62", marginBottom: "3px" }}>Jun 15 – 22 · Cabo San Lucas, Mexico</div>
              <div style={{ fontSize: "11px", color: "#4A7A62" }}>Organized by Bianca · 3 households joining</div>
            </div>
            <div style={{ background: "#FFFCF8", border: "1px solid #E6DED3", borderRadius: "12px", padding: "12px 14px", marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#8A847C", marginBottom: "10px" }}>What you'll need to do</div>
              {[
                { icon: <Plane size={14} color="#4A6880" />, label: "Book flights", bg: "#E8EEF4" },
                { icon: <BedDouble size={14} color="#6B4E2E" />, label: "Book hotel", bg: "#EAE4DC" },
                { icon: <Shield size={14} color="#8C4F32" />, label: "Travel insurance", bg: "#F0E2D4" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: i < 2 ? "1px solid #E6DED3" : "none" }}>
                  <div style={{ width: "28px", height: "28px", background: t.bg, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>{t.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: 500, color: "#1F1F1F", flex: 1 }}>{t.label}</div>
                  <div style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: "#EFE9E0", color: "#8A847C", fontWeight: 500 }}>Required</div>
                </div>
              ))}
            </div>
            <button style={s.btn} onClick={() => handleComplete("attendee")}>Join this trip →</button>
            <button style={s.btnSec} onClick={() => setStep("join-code")}>← Back</button>
          </>
        )}
      </div>
    </div>
  );
}
