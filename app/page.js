"use client";

import { useEffect, useState } from "react";

const faqs = [
  {
    q: "What are your business hours?",
    a: "We're here to help! Share your opening hours with customers so they know when to reach your team.",
  },
  {
    q: "How do I track my order?",
    a: "Please share your order number and our team can help you check its status.",
  },
  {
    q: "How can I get a refund?",
    a: "We can help with that. Please share your order number and a little detail about your request.",
  },
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [businessInfo, setBusinessInfo] = useState("");
  const [businessInfoLoaded, setBusinessInfoLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedInfo = window.localStorage.getItem("supportai-business-info");
      if (savedInfo) setBusinessInfo(savedInfo);
    } catch {
      // Storage may be unavailable in private browsing; the demo still works.
    }
    setBusinessInfoLoaded(true);
  }, []);

  useEffect(() => {
    if (!businessInfoLoaded) return;
    try {
      window.localStorage.setItem("supportai-business-info", businessInfo);
    } catch {
      // The information remains usable for this session if storage is unavailable.
    }
  }, [businessInfo, businessInfoLoaded]);

  async function handleSubmit(e) {
    e.preventDefault();
    const question = message.trim();
    if (!question || loading) return;
    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, businessInfo }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again.");
      setReply(data.reply);
    } catch (error) {
      setReply(error.message || "Could not reach SupportAI. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: { minHeight: "100vh", background: "#0b1020", color: "#f5f7ff", fontFamily: "Inter, Arial, sans-serif" },
    nav: { maxWidth: 1100, margin: "0 auto", padding: "24px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 },
    logo: { fontWeight: 800, fontSize: 22, letterSpacing: "-.8px" },
    button: { display: "inline-block", background: "#8b7cff", color: "#0b1020", padding: "12px 18px", borderRadius: 10, border: 0, fontWeight: 800, textDecoration: "none", cursor: "pointer" },
    section: { maxWidth: 1100, margin: "0 auto", padding: "64px 24px" },
    muted: { color: "#aab3cc", lineHeight: 1.7 },
    panel: { background: "#141b30", border: "1px solid #2b3553", borderRadius: 18, padding: 24 },
    tag: { color: "#bdb5ff", fontSize: 13, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase" },
  };

  return (
    <main style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.logo}><span style={{ color: "#9d91ff" }}>✦</span> SupportAI</div>
        <a href="#demo" style={styles.button}>Try the demo ↗</a>
      </nav>

      <section style={{ ...styles.section, paddingTop: 72, paddingBottom: 72, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", alignItems: "center", gap: 44 }}>
        <div>
          <p style={styles.tag}>CUSTOMER SUPPORT, REIMAGINED</p>
          <h1 style={{ fontSize: "clamp(42px, 7vw, 68px)", lineHeight: 1.04, letterSpacing: "-2.8px", margin: "18px 0" }}>
            Great support.<br /><span style={{ color: "#a69bff" }}>Less busywork.</span>
          </h1>
          <p style={{ ...styles.muted, fontSize: 18, maxWidth: 520 }}>
            Help your customers get answers faster. SupportAI is a simple starting point for smarter, round-the-clock customer support.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <a href="#demo" style={styles.button}>Try the live demo ↓</a>
            <a href="#features" style={{ ...styles.button, background: "transparent", color: "#f5f7ff", border: "1px solid #3a4565" }}>Explore features</a>
          </div>
          <p style={{ ...styles.muted, fontSize: 13, marginTop: 18 }}>A free preview · No account needed</p>
        </div>
        <div style={{ ...styles.panel, boxShadow: "0 24px 80px #0005" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #2b3553", paddingBottom: 18 }}>
            <div style={{ background: "#8b7cff22", borderRadius: 12, padding: 12, fontSize: 22 }}>✦</div>
            <div><strong>SupportAI Assistant</strong><div style={{ color: "#79dfb0", fontSize: 12, marginTop: 4 }}>● Preview mode</div></div>
          </div>
          <div style={{ background: "#202943", padding: 16, borderRadius: "14px 14px 14px 4px", marginTop: 22, lineHeight: 1.6 }}>
            Hi there! 👋 I can help with common customer questions. What would you like to know?
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <div style={{ background: "#7567e8", padding: 14, borderRadius: "14px 14px 4px 14px" }}>Where is my order?</div>
          </div>
          <div style={{ background: "#202943", padding: 16, borderRadius: "14px 14px 14px 4px", marginTop: 14, lineHeight: 1.6 }}>
            Please share your order number and our team can help you check its status.
          </div>
          <p style={{ ...styles.muted, fontSize: 12, marginBottom: 0 }}>Illustrative conversation</p>
        </div>
      </section>

      <section id="features" style={{ ...styles.section, paddingTop: 36 }}>
        <p style={styles.tag}>BUILT FOR BUSY TEAMS</p>
        <h2 style={{ fontSize: 34, letterSpacing: "-1px", margin: "12px 0 28px" }}>Support that works smarter</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 16 }}>
          {[
            ["⚡", "Faster replies", "Give customers a helpful first response without the long wait."],
            ["◷", "Always available", "Offer a support experience beyond standard office hours."],
            ["◎", "One clear experience", "Keep your customer support simple, consistent, and easy to use."],
          ].map(([icon, title, description]) => (
            <div key={title} style={styles.panel}>
              <div style={{ fontSize: 27 }}>{icon}</div>
              <h3 style={{ marginBottom: 8 }}>{title}</h3>
              <p style={{ ...styles.muted, fontSize: 14, marginBottom: 0 }}>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="demo" style={{ ...styles.section, paddingTop: 42 }}>
        <div style={{ ...styles.panel, maxWidth: 760, margin: "0 auto" }}>
          <p style={styles.tag}>INTERACTIVE PREVIEW</p>
          <h2 style={{ fontSize: 32, margin: "10px 0" }}>Ask SupportAI a question</h2>
          <p style={styles.muted}>Ask a question. Add your business details below so SupportAI can answer using your information. This demo saves details in this browser only.</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="businessInfo" style={{ display: "block", fontWeight: 700, margin: "22px 0 8px" }}>Business information (optional)</label>
            <textarea id="businessInfo" value={businessInfo} onChange={(e) => setBusinessInfo(e.target.value)} placeholder="Opening hours, refund policy, delivery details, FAQs…" rows={4} maxLength={6000} style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 10, border: "1px solid #3a4565", background: "#0b1020", color: "#f5f7ff", font: "inherit", resize: "vertical" }} />
            <label htmlFor="question" style={{ display: "block", fontWeight: 700, margin: "22px 0 8px" }}>Your question</label>
            <textarea id="question" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. How can I get a refund?" rows={3} style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 10, border: "1px solid #3a4565", background: "#0b1020", color: "#f5f7ff", font: "inherit", resize: "vertical" }} />
            <button type="submit" disabled={loading} style={{ ...styles.button, marginTop: 12, opacity: loading ? 0.7 : 1 }}>{loading ? "Thinking…" : "Ask SupportAI ↗"}</button>
          </form>
          {reply && <div role="status" style={{ background: "#202943", border: "1px solid #3a4565", padding: 18, borderRadius: 12, marginTop: 20 }}><strong style={{ color: "#bdb5ff" }}>SupportAI reply</strong><p style={{ lineHeight: 1.7, marginBottom: 0 }}>{reply}</p></div>}
        </div>
      </section>

      <section style={{ ...styles.section, paddingTop: 20, paddingBottom: 70, textAlign: "center" }}>
        <h2 style={{ fontSize: 30 }}>Ready to make support simpler?</h2>
        <p style={styles.muted}>Live AI answers are being tested. Customer accounts and subscriptions are not enabled yet.</p>
        <a href="#demo" style={styles.button}>Explore the demo ↑</a>
      </section>
      <footer style={{ borderTop: "1px solid #252e48", padding: 24, textAlign: "center", color: "#8e99b6", fontSize: 13 }}>
        © {new Date().getFullYear()} SupportAI · Built for better customer conversations
      </footer>
    </main>
  );
}
