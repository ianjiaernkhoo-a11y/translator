"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTranslate() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Translation failed");
      setOutput(data.translation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Legal Translator</h1>

      <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem" }}>
        English
      </label>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={8}
        placeholder="Type legal advice in English..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0.75rem",
          fontSize: "1rem",
          fontFamily: "inherit",
        }}
      />

      <button
        onClick={handleTranslate}
        disabled={loading || !input.trim()}
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1.4rem",
          fontSize: "1rem",
          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Translating..." : "Translate"}
      </button>

      {error && (
        <p role="alert" style={{ color: "#b00020", marginTop: "1rem" }}>
          {error}
        </p>
      )}

      <label style={{ display: "block", fontWeight: 600, margin: "1.5rem 0 0.5rem" }}>
        Mandarin (review and edit before use)
      </label>
      <textarea
        value={output}
        onChange={(e) => setOutput(e.target.value)}
        rows={8}
        placeholder="Translation will appear here..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0.75rem",
          fontSize: "1rem",
          fontFamily: "inherit",
        }}
      />
    </main>
  );
}
