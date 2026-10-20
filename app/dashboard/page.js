"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");
  const [message, setMessage] = useState("Loading your account…");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!supabase) {
        setMessage("Supabase isn't connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy.");
        return;
      }
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!alive) return;
      if (!currentSession) {
        router.replace("/login");
        return;
      }
      setSession(currentSession);
      const { data, error } = await supabase.from("business_profiles").select("business_name,business_info").eq("user_id", currentSession.user.id).maybeSingle();
      if (!alive) return;
      if (error) {
        setMessage("Your database table isn't ready yet. In Supabase, open SQL Editor and run the setup SQL from the SupportAI repository file supabase/schema.sql.");
        return;
      }
      setBusinessName(data?.business_name || "");
      setBusinessInfo(data?.business_info || "");
      setMessage("");
    }
    load();
    return () => { alive = false; };
  }, [router]);

  async function saveProfile(event) {
    event.preventDefault();
    if (!supabase || !session) return;
    setBusy(true);
    setMessage("");
    const { error } = await supabase.from("business_profiles").upsert({
      user_id: session.user.id,
      business_name: businessName.trim(),
      business_info: businessInfo.trim(),
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" });
    setBusy(false);
    setMessage(error ? "Couldn't save your details: " + error.message : "Saved securely to your account.");
  }

  async function logOut() {
    if (supabase) await supabase.auth.signOut();
    router.replace("/login");
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: 13, borderRadius: 10, border: "1px solid #3a4565", background: "#0b1020", color: "#f5f7ff", font: "inherit", marginTop: 7 };
  return (
    <main style={{ minHeight: "100vh", background: "#0b1020", color: "#f5f7ff", fontFamily: "Arial, sans-serif", padding: "28px 18px" }}>
      <header style={{ maxWidth: 850, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <a href="/" style={{ color: "#bdb5ff", textDecoration: "none", fontWeight: 800, fontSize: 20 }}>✦ SupportAI</a>
        <button onClick={logOut} style={{ border: "1px solid #3a4565", background: "transparent", color: "#f5f7ff", padding: "10px 14px", borderRadius: 9 }}>Log out</button>
      </header>
      <section style={{ maxWidth: 850, margin: "42px auto", background: "#141b30", border: "1px solid #2b3553", borderRadius: 18, padding: 24 }}>
        <p style={{ color: "#bdb5ff", fontSize: 12, fontWeight: 800, letterSpacing: 1.3 }}>BUSINESS DASHBOARD</p>
        <h1 style={{ fontSize: 32, margin: "8px 0" }}>Your support settings</h1>
        <p style={{ color: "#aab3cc", lineHeight: 1.6 }}>Save your business details to your account so you can access them again after logging in.</p>
        {!session && <p style={{ color: "#aab3cc" }}>{message}</p>}
        {session && <form onSubmit={saveProfile}>
          <label htmlFor="businessName">Business name</label>
          <input id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} maxLength={160} placeholder="Your company name" style={inputStyle} />
          <label htmlFor="businessInfo" style={{ display: "block", marginTop: 18 }}>Business information</label>
          <textarea id="businessInfo" value={businessInfo} onChange={e => setBusinessInfo(e.target.value)} maxLength={6000} rows={8} placeholder="Opening hours, refund policy, delivery details, FAQs…" style={{ ...inputStyle, resize: "vertical" }} />
          <button type="submit" disabled={busy} style={{ marginTop: 16, padding: "13px 18px", border: 0, borderRadius: 10, background: "#8b7cff", color: "#0b1020", fontWeight: 800, opacity: busy ? 0.7 : 1 }}>{busy ? "Saving…" : "Save business details"}</button>
        </form>}
        {message && <p role="status" style={{ marginTop: 18, padding: 12, background: "#202943", borderRadius: 10, lineHeight: 1.5, overflowWrap: "anywhere" }}>{message}</p>}
      </section>
    </main>
  );
}
