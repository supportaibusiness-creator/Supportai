"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");
  const [businessInfoLoaded, setBusinessInfoLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function loadBusinessInfo() {
      try {
        const savedInfo = window.localStorage.getItem("supportai-business-info");
        if (savedInfo && alive) setBusinessInfo(savedInfo);
      } catch {}
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && alive) {
            const { data, error } = await supabase.from("business_profiles").select("business_info").eq("user_id", session.user.id).maybeSingle();
            if (!error && data?.business_info && alive) setBusinessInfo(data.business_info);
          }
        } catch {}
      }
      if (alive) setBusinessInfoLoaded(true);
    }
    loadBusinessInfo();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!businessInfoLoaded) return;
    try { window.localStorage.setItem("supportai-business-info", businessInfo); } catch {}
  }, [businessInfo, businessInfoLoaded]);

  async function handleSubmit(e) {
    e.preventDefault();
    const question = message.trim();
    if (!question || loading) return;
    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, businessInfo }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again.");
      setReply(data.reply);
    } catch (error) {
      setReply(error.message || "Could not reach SupportAI. Please try again.");
    } finally { setLoading(false); }
  }

  const card = { background: "#fff", border: "1px solid #eeecf5", borderRadius: 20, padding: 24, boxShadow: "0 8px 30px #30245b08" };
  const muted = { color: "#77738e", lineHeight: 1.75 };
  const primary = { display: "inline-block", background: "#8978f3", color: "#fff", padding: "13px 19px", borderRadius: 11, border: 0, fontWeight: 750, textDecoration: "none", cursor: "pointer", boxShadow: "0 5px 12px #8978f32b" };
  const secondary = { ...primary, background: "#fff", color: "#514b6d", border: "1px solid #e3e1f2", boxShadow: "none" };

  return (
    <main style={{ minHeight: "100vh", background: "#f8f7fc", color: "#24213a", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <nav style={{ background: "#fff", borderBottom: "1px solid #eeecf5" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "17px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <a href="/" style={{ fontWeight: 850, fontSize: 23, letterSpacing: "-.8px", color: "#342d59", textDecoration: "none" }}><span style={{ color: "#8978f3" }}>✦</span> SupportAI</a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <a href="/login?mode=login" style={secondary}>Log in</a>
            <a href="/login?mode=signup" style={primary}>Get started ↗</a>
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(48px, 8vw, 92px) 22px 64px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", alignItems: "center", gap: 48 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, background: "#f0edff", color: "#6d5cdb", fontSize: 12, fontWeight: 800, letterSpacing: ".8px" }}>✦ CUSTOMER SUPPORT, SIMPLIFIED</div>
          <h1 style={{ fontSize: "clamp(42px, 7vw, 68px)", lineHeight: 1.04, letterSpacing: "-2.8px", margin: "22px 0 18px", maxWidth: 650 }}>Helpful answers.<br /><span style={{ color: "#8978f3" }}>Less busywork.</span></h1>
          <p style={{ ...muted, fontSize: 18, maxWidth: 550 }}>Give customers faster answers with an AI assistant that uses your business information — from opening hours to refund policies.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <a href="#demo" style={primary}>Try the live demo ↓</a>
            <a href="#features" style={secondary}>Explore features</a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 28, color: "#77738e", fontSize: 13 }}>
            <span>✓ Easy to set up</span><span>✓ Answers based on your info</span><span>✓ Available around the clock</span>
          </div>
        </div>
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "19px 22px", borderBottom: "1px solid #eeecf5", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: "#f0edff", color: "#7969e8", display: "grid", placeItems: "center", fontSize: 21 }}>✦</div>
            <div><strong style={{ display: "block" }}>SupportAI Assistant</strong><span style={{ color: "#278052", fontSize: 12 }}>● Demo conversation</span></div>
          </div>
          <div style={{ padding: 22 }}>
            <div style={{ background: "#f5f4fa", padding: 15, borderRadius: "14px 14px 14px 4px", lineHeight: 1.65, color: "#514b6d" }}>Hi there! 👋 I can help answer questions about a business.</div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}><div style={{ background: "#8978f3", color: "#fff", padding: 14, borderRadius: "14px 14px 4px 14px" }}>What is your refund policy?</div></div>
            <div style={{ background: "#f5f4fa", padding: 15, borderRadius: "14px 14px 14px 4px", marginTop: 14, lineHeight: 1.65, color: "#514b6d" }}>I can explain the refund policy using the information provided by the business.</div>
            <div style={{ borderTop: "1px solid #eeecf5", marginTop: 22, paddingTop: 15, color: "#89859d", fontSize: 12 }}>A clearer support experience, for every customer.</div>
          </div>
        </div>
      </section>

      <section id="features" style={{ background: "#fff", borderTop: "1px solid #eeecf5", borderBottom: "1px solid #eeecf5" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "64px 22px" }}>
          <div style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 30px" }}><p style={{ color: "#7969e8", fontSize: 12, fontWeight: 800, letterSpacing: 1.5 }}>MADE FOR YOUR BUSINESS</p><h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", letterSpacing: "-1px", margin: "10px 0" }}>The essentials, all in one place.</h2><p style={muted}>Give your customers consistent answers and keep your support information organised.</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 16 }}>
            {[["✦","Answers informed by you","Add your policies, business hours and frequently asked questions."],["◷","Support beyond office hours","Help customers find key information whenever they need it."],["⌘","Simple business settings","Keep your support details saved to your account."]].map(([icon,title,description]) => <article key={title} style={{ ...card, boxShadow: "none" }}><div style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 14, background: "#f0edff", color: "#7969e8", fontSize: 23 }}>{icon}</div><h3 style={{ fontSize: 17, margin: "18px 0 8px" }}>{title}</h3><p style={{ ...muted, fontSize: 14, margin: 0 }}>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="demo" style={{ maxWidth: 1160, margin: "0 auto", padding: "70px 22px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", ...card, padding: "clamp(20px, 4vw, 34px)" }}>
          <p style={{ color: "#7969e8", fontSize: 12, fontWeight: 800, letterSpacing: 1.5 }}>TRY IT YOURSELF</p>
          <h2 style={{ fontSize: 30, letterSpacing: "-.8px", margin: "10px 0" }}>Ask SupportAI a question</h2>
          <p style={muted}>Try a sample conversation. Log in to manage your saved business information.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="businessInfo" style={{ display: "block", fontWeight: 700, fontSize: 14, margin: "22px 0 8px" }}>Business information (optional)</label>
            <textarea id="businessInfo" value={businessInfo} onChange={e => setBusinessInfo(e.target.value)} placeholder="Opening hours, refund policy, delivery details, FAQs…" rows={4} maxLength={6000} style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 12, border: "1px solid #e3e1f2", background: "#fff", color: "#24213a", font: "inherit", resize: "vertical", outlineColor: "#9a8cf5" }} />
            <label htmlFor="question" style={{ display: "block", fontWeight: 700, fontSize: 14, margin: "20px 0 8px" }}>Your question</label>
            <textarea id="question" value={message} onChange={e => setMessage(e.target.value)} placeholder="e.g. What are your opening hours?" rows={3} style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 12, border: "1px solid #e3e1f2", background: "#fff", color: "#24213a", font: "inherit", resize: "vertical", outlineColor: "#9a8cf5" }} />
            <button type="submit" disabled={loading} style={{ ...primary, marginTop: 14, opacity: loading ? .7 : 1 }}>{loading ? "Thinking…" : "Ask SupportAI ↗"}</button>
          </form>
          {reply && <div role="status" style={{ background: "#f5f3ff", border: "1px solid #e7e2ff", color: "#514b6d", padding: 18, borderRadius: 13, marginTop: 20 }}><strong style={{ color: "#6d5cdb" }}>SupportAI reply</strong><p style={{ lineHeight: 1.7, marginBottom: 0 }}>{reply}</p></div>}
        </div>
      </section>

      <section style={{ background: "#f0edff", padding: "52px 22px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(27px, 4vw, 36px)", letterSpacing: "-1px", margin: "0 0 12px" }}>Ready to make support simpler?</h2>
        <p style={{ ...muted, margin: "0 auto 22px" }}>Set up your business assistant and make it your own.</p>
        <a href="/login?mode=signup" style={primary}>Create your account ↗</a>
      </section>
      <footer style={{ background: "#fff", borderTop: "1px solid #eeecf5", padding: 24, textAlign: "center", color: "#89859d", fontSize: 13 }}>© {new Date().getFullYear()} SupportAI · Better customer conversations</footer>
    </main>
  );
}
