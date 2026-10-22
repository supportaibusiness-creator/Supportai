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

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: "14px 15px", borderRadius: 12, border: "1px solid #e3e1f2", background: "#ffffff", color: "#24213a", font: "inherit", marginTop: 8, outlineColor: "#9a8cf5" };
  const navLink = { textDecoration: "none", color: "#625c7c", fontSize: 14, fontWeight: 600, padding: "10px 12px", borderRadius: 10 };
  return (
    <main style={{ minHeight: "100vh", background: "#f8f7fc", color: "#24213a", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #eeecf5", position: "sticky", top: 0, zIndex: 5 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "17px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#342d59", textDecoration: "none", fontWeight: 850, fontSize: 22, letterSpacing: "-.7px" }}><span style={{ color: "#8b7cf6" }}>✦</span> SupportAI</a>
          <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <a href="/" style={navLink}>Home</a>
            <a href="/dashboard" style={{ ...navLink, color: "#6b5be7", background: "#f0edff" }}>Business settings</a>
            <button onClick={logOut} style={{ border: "1px solid #e3e1f2", background: "#fff", color: "#514b6d", padding: "10px 13px", borderRadius: 10, font: "inherit", fontSize: 14, fontWeight: 650, cursor: "pointer", marginLeft: 4 }}>Log out</button>
          </nav>
        </div>
      </header>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "34px 22px 64px" }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ color: "#7969e8", fontSize: 12, fontWeight: 800, letterSpacing: 1.5, margin: "0 0 10px" }}>WORKSPACE SETTINGS</p>
          <h1 style={{ fontSize: "clamp(30px, 5vw, 42px)", letterSpacing: "-1.5px", lineHeight: 1.12, margin: "0 0 10px" }}>Your business, in one place.</h1>
          <p style={{ color: "#77738e", lineHeight: 1.7, margin: 0, maxWidth: 650 }}>Manage the information SupportAI uses to answer customer questions. Your changes are saved to your account.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 245px), 1fr))", gap: 18, alignItems: "start" }}>
          <aside style={{ display: "grid", gap: 12 }}>
            <div style={{ background: "#fff", border: "1px solid #eeecf5", borderRadius: 18, padding: 20, boxShadow: "0 4px 18px #30245b08" }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: "#f0edff", color: "#7969e8", fontSize: 21, marginBottom: 14 }}>✦</div>
              <h2 style={{ fontSize: 16, margin: "0 0 7px" }}>AI knowledge</h2>
              <p style={{ color: "#77738e", fontSize: 13, lineHeight: 1.65, margin: 0 }}>Your business details help the assistant give more accurate answers.</p>
            </div>
            <div style={{ background: "#f0edff", border: "1px solid #e7e2ff", borderRadius: 18, padding: 20 }}>
              <p style={{ color: "#6d5cdb", fontSize: 12, fontWeight: 800, letterSpacing: 1, margin: "0 0 8px" }}>QUICK TIP</p>
              <p style={{ color: "#51477f", fontSize: 13, lineHeight: 1.7, margin: 0 }}>Include opening hours, refund rules, delivery information and answers to common questions.</p>
            </div>
          </aside>
          <section style={{ background: "#fff", border: "1px solid #eeecf5", borderRadius: 20, padding: "clamp(20px, 4vw, 32px)", boxShadow: "0 8px 30px #30245b08", gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 21, letterSpacing: "-.4px", margin: "0 0 6px" }}>Business profile</h2>
                <p style={{ color: "#77738e", fontSize: 14, lineHeight: 1.6, margin: 0 }}>Keep these details up to date so your assistant knows your business.</p>
              </div>
              <span style={{ background: "#eaf8f0", color: "#27734b", borderRadius: 999, padding: "6px 10px", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>ACCOUNT DATA</span>
            </div>
            {!session && <p style={{ color: "#77738e" }}>{message}</p>}
            {session && <form onSubmit={saveProfile}>
              <label htmlFor="businessName" style={{ display: "block", fontWeight: 700, fontSize: 14, color: "#393450" }}>Business name</label>
              <input id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} maxLength={160} placeholder="Your company name" style={inputStyle} />
              <label htmlFor="businessInfo" style={{ display: "block", marginTop: 22, fontWeight: 700, fontSize: 14, color: "#393450" }}>Business information</label>
              <textarea id="businessInfo" value={businessInfo} onChange={e => setBusinessInfo(e.target.value)} maxLength={6000} rows={9} placeholder="Opening hours, refund policy, delivery details, FAQs…" style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }} />
              <p style={{ color: "#89859d", fontSize: 12, lineHeight: 1.5 }}>Only include information you want SupportAI to use when answering customer questions.</p>
              <button type="submit" disabled={busy} style={{ marginTop: 8, padding: "13px 19px", border: 0, borderRadius: 11, background: "#8978f3", color: "#fff", fontWeight: 750, fontSize: 14, opacity: busy ? .7 : 1, cursor: busy ? "wait" : "pointer", boxShadow: "0 5px 12px #8978f32b" }}>{busy ? "Saving changes…" : "Save changes"}</button>
            </form>}
            {message && <p role="status" style={{ marginTop: 18, padding: 13, background: message.startsWith("Saved") ? "#eaf8f0" : "#f5f3ff", color: message.startsWith("Saved") ? "#27734b" : "#625c7c", borderRadius: 11, lineHeight: 1.6, overflowWrap: "anywhere", fontSize: 14 }}>{message}</p>}
          </section>
        </div>
      </div>
    </main>
  );
}
