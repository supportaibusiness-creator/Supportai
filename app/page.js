"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    setReply(
      "Thanks for contacting us! We've received your message and will get back to you as soon as possible."
    );
  }

  return (
    <main style={{ fontFamily: "Arial, sans-serif", maxWidth: 700, margin: "60px auto", padding: 24 }}>
      <h1>SupportAI — AI Customer Support</h1>
      <p>Give your customers fast, helpful support around the clock.</p>

      <h2>Try the demo</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a customer question..."
          rows={4}
          style={{ width: "100%", padding: 12, boxSizing: "border-box" }}
        />
        <button type="submit" style={{ marginTop: 12, padding: "12px 20px" }}>
          Send message
        </button>
      </form>

      {reply && (
        <p style={{ marginTop: 20, padding: 16, background: "#f0f4f8", color: "#111" }}>
          {reply}
        </p>
      )}
    </main>
  );
}
