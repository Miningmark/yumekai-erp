"use client";
import styled from "styled-components";

const SoonBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SoonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--light);
  color: var(--dark);
  width: 80%;
  border-radius: var(--border-radius);

  h2 {
    text-align: center;
  }
`;

export default function CommingSoon() {
  return (
    <SoonBackground>
      <h1>Comming Soon</h1>
      <SoonContainer>
        <ul>
          <li>Kostenkalkulation</li>
          <li>Ehrengäste Zeitplan</li>
          <li>Verschiedene Automatismen</li>
          <li>Benachrichtigungen</li>
          <li>E-Mail sender</li>
          <li>Einstellungen</li>
          <li>Suchfunktion</li>
          <li>Smartphone Support</li>
          <li>Lightmode</li>
          <li>Passwort zurücksetzen</li>
          <li>Beim Task erstellen löschen von subtasks</li>
          <li>Kontaklisten für Helfer und Aussteller</li>
          <li>Farb Legende für Kanban Board</li>
          <li>Last logins auf Profilseite IP fixen und reihenfolge ändern neu zu alt</li>
          <li>Admin Page überarbeiten</li>
          <li>Tasks ohne subtasks haben plötzlich 1 subtast (noch auf fehlersuche)</li>
        </ul>
      </SoonContainer>
    </SoonBackground>
  );
}
