"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { CadynLogo } from "@/components/cadyn-logo";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else {
      setMessage("Password updated. Redirecting...");
      setTimeout(() => { window.location.href = "/"; }, 2000);
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
          Set new password
        </h1>
        <p style={{ fontSize: "14px", color: "#8A847C", marginBottom: "28px" }}>
          Choose a new password for your account
        </p>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "#6F6A63", display: "block", marginBottom: "6px" }}>
            New password
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
          onClick={handleReset}
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
          }}
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
