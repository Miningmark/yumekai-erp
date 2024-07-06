"use client";

import styled from "styled-components";
import { useState } from "react";

export default function DashBoard() {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("test@miningmark.de");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(from, to, subject, text);
    const res = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
    });

    if (res.ok) {
      alert("E-Mail erfolgreich gesendet");
    } else {
      alert("Fehler beim Senden der E-Mail");
    }
  };

  return (
    <>
      <h1>Dashboard</h1>
      <h1>Bitte testen! Sende dir eine E-Mail</h1>
      <br />
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <p>E-Mail von:</p>
            <label>
              <input
                type="radio"
                value="test@miningmark.de"
                checked={from === "test@miningmark.de"}
                onChange={(e) => setFrom(e.target.value)}
              />
              test@
            </label>
            <label>
              <input
                type="radio"
                value="system@miningmark.de"
                checked={from === "system@miningmark.de"}
                onChange={(e) => setFrom(e.target.value)}
              />
              system@
            </label>
          </div>
          <input
            type="email"
            placeholder="Empfänger"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Betreff"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            placeholder="Nachricht"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button type="submit">E-Mail senden</button>
        </form>
      </div>
    </>
  );
}
