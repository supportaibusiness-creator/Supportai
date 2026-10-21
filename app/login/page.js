"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase) {
      setMessage("SupportAI is not connected to its account service. Please try again later.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.session) {
          router.push("/dashboard");
        } else {
          setMessage("Account created. Check your email to confirm your account, then log in.");
          setMode("login");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (error) {
      setMessage(error.message || "Couldn't complete that request. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendRecovery() {
    if (!supabase) {
      setMessage("SupportAI is not connected to its account service. Please try again later.");
      return;
    }
    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage("If an account exists for that email, a password-reset link has been sent. Check your inbox and spam folder.");
    } catch (error) {
      setMessage(error.message || "Couldn't send the reset email. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: 13, borderRadius: 10, border: "1px solid #3a4565", background: "#0b1020", color: "#f5f7ff", font: "inherit", marginTop: 7 };
  const buttonStyle = { width: "100%", padding: 13, borderRadius: 10, border: 0, background: "#8b7cff", color: "#0b1020", fontWeight: 800, fontSize: 15, marginTop: 18, cursor: "pointer" };

  return (
    <main style={{ minHeight: "100vh", background: "#0b1020", color: "#f5f7ff", fontFamily: "Arial, sans-serif", padding: "28px 18px", display: "grid", placeItems: "center" }}>
      <section style={{ width: "100%", maxWidth: 430, background: "#141b30", border: "1px solid #2b3553", borderRadius: 18, padding: 24, boxSizing: "border-box" }}>
        <a href="/" style={{ color: "#bdb5ff", textDecoration: "none", fontWeight: 800 }}>✦ SupportAI</a>
        <h1 style={{ fontSize: 30, marginBottom: 8 }}>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <p style={{ color: "#aab3cc", lineHeight: 1.6 }}>{mode === "signup" ? "Create an account to save your business support information." : "Log in to manage your business information."}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          <label htmlFor="password" style={{ display: "block", marginTop: 16 }}>Password (at least 6 characters)</label>
          <input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          <button disabled={busy} type="submit" style={{ ...buttonStyle, opacity: busy ? 0.7 : 1 }}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}</button>
        </form>
        {mode === "login" && <button type="button" disabled={busy} onClick={sendRecovery} style={{ width: "100%", marginTop: 14, border: 0, background: "transparent", color: "#bdb5ff", font: "inherit", cursor: "pointer", textDecoration: "underline" }}>Forgot your password?</button>}
        {message && <p role="status" style={{ background: "#202943", borderRadius: 10, padding: 12, lineHeight: 1.5, overflowWrap: "anywhere" }}>{message}</p>}
        <p style={{ color: "#aab3cc", marginTop: 20, fontSize: 14 }}>
          {mode === "signup" ? "Already have an account? " : "New to SupportAI? "}
          <button type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setMessage(""); }} style={{ border: 0, background: "none", color: "#bdb5ff", font: "inherit", fontWeight: 700, cursor: "pointer" }}>{mode === "signup" ? "Log in" : "Create account"}</button>
        </p>
      </section>
    </main>
  );
}
