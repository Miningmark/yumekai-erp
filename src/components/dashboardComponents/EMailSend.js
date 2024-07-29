import { useState, useEffect } from "react";
import styled from "styled-components";

const EMailSendContainer = styled.div`
  width: 300px;
  height: 450px;
  padding: 20px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px;

  h2 {
    margin: 0;
    padding: 10px;
    text-align: center;
  }
`;

export default function EMailSend() {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("test@miningmark.de");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(from, to, subject, text);
    const res = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text, auth: "email-test" }),
    });

    if (res.ok) {
      alert("E-Mail erfolgreich gesendet");
    } else {
      alert("Fehler beim Senden der E-Mail");
    }
  };

  return (
    <EMailSendContainer>
      <h2>Bitte testen! Sende dir eine E-Mail</h2>
      <h3>E-Mail Sender</h3>
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
        <br />
        <input
          type="email"
          placeholder="Empfänger"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Betreff"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <br />
        <br />
        <textarea
          placeholder="Nachricht"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">E-Mail senden</button>
      </form>
    </EMailSendContainer>
  );
}
