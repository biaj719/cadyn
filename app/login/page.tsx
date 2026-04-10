"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CadynLogo } from "@/components/cadyn-logo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.href = "/trips";
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F2EC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "#FFFCF8",
        border: "1px solid #E6DED3",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
      }}>
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "center" }}>
          <CadynLogo />
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1F1F1F", marginBottom: "8px" }}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p style={{ fontSize: "14px", color: "#8A847C", marginBottom: "28px" }}>
          {isSignUp ? "Start coordinating your group travel" : "Sign in to your Cadyn account"}
        </p>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6F6A63", display: "block", marginBottom: "6px" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #E6DED3",
              fontSize: "14px",
              background: "#F5F2EC",
              color: "#1F1F1F",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6F6A63", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #E6DED3",
              fontSize: "14px",
              background: "#F5F2EC",
              color: "#1F1F1F",
              outline: "none",
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: "13px", color: "#C0392B", marginBottom: "16px" }}>{error}</p>
        )}
        {message && (
          <p style={{ fontSize: "13px", color: "#2F6F5A", marginBottom: "16px" }}>{message}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#3D5C50",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginBottom: "16px",
          }}
        >
          {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
        </button>

        <p style={{ fontSize: "13px", color: "#8A847C", textAlign: "center" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ color: "#3D5C50", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
