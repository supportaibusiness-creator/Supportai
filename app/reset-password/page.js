"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase) {
      setMessage("SupportAI is not connected to its account service. Please try again later.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("The passwords don't match.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Password updated. Taking you to login…");
      setTimeout(() => router.replace("/login"), 1200);
    } catch (error) {
      setMessage(error.message || "This reset link may have expired. Request a new one from the login page.");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: 13, borderRadius: 10, border: "1px solid #3a4565", background: "#0b1020", color: "#f5f7ff", font: "inherit", marginTop: 7 };

  return (
    <main style={{ minHeight: "100vh", background: "#0b1020", color: "#f5f7ff", fontFamily: "Arial, sans-serif", padding: "28px 18px", display: "grid", placeItems: "center" }}>
      <section style={{ width: "100%", maxWidth: 430, background: "#141b30", border: "1px solid #2b3553", borderRadius: 18, padding: 24, boxSizing: "border-box" }}>
        <a href="/" style={{ color: "#bdb5ff", textDecoration: "none", fontWeight: 800 }}>✦ SupportAI</a>
        <h1 style={{ fontSize: 30 }}>Choose a new password</h1>
        <p style={{ color: "#aab3cc", lineHeight: 1.6 }}>Use at least 6 characters and enter it twice.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New password</label>
          <input id="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          <label htmlFor="confirmPassword" style={{ display: "block", marginTop: 16 }}>Confirm new password</label>
          <input id="confirmPassword" type="password" autoComplete="new-password" minLength={6} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inputStyle} />
          <button disabled={busy} type="submit" style={{ width: "100%", padding: 13, borderRadius: 10, border: 0, background: "#8b7cff", color: "#0b1020", fontWeight: 800, fontSize: 15, marginTop: 18, opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : "Update password"}</button>
        </form>
        {message && <p role="status" style={{ background: "#202943", borderRadius: 10, padding: 12, lineHeight: 1.5, overflowWrap: "anywhere" }}>{message}</p>}
      </section>
    </main>
  );
}
