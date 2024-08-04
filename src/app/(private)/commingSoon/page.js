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
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  width: 80%;
  border-radius: var(--border-radius);

  h2 {
    text-align: center;
  }
`;

const CommingSoonListItem = styled.li`
  padding-bottom: 5px;
`;

export default function CommingSoon() {
  return (
    <SoonBackground>
      <h1>Comming Soon</h1>
      <SoonContainer>
        <ul>
          <CommingSoonListItem>Kostenkalkulation</CommingSoonListItem>
          <CommingSoonListItem>Ehrengäste Zeitplan</CommingSoonListItem>
          <CommingSoonListItem>Verschiedene Automatismen</CommingSoonListItem>
          <CommingSoonListItem>Benachrichtigungen</CommingSoonListItem>
          <CommingSoonListItem>E-Mail sender</CommingSoonListItem>
          <CommingSoonListItem>Einstellungen</CommingSoonListItem>
          <CommingSoonListItem>Suchfunktion für Kanbanboard</CommingSoonListItem>
          <CommingSoonListItem>Smartphone Support</CommingSoonListItem>
          <CommingSoonListItem>Farb Legende für Kanban Board</CommingSoonListItem>
          <CommingSoonListItem>Admin Page überarbeiten</CommingSoonListItem>
          <CommingSoonListItem>Login dauer auf 3-7 Tage erhöhen</CommingSoonListItem>
          <CommingSoonListItem>E-Mail benachrichtigung bei neuem Login</CommingSoonListItem>
          <CommingSoonListItem>
            Eingang neuer Kontaktanfragen anzeigen auf Dashboard
          </CommingSoonListItem>
          <CommingSoonListItem>Account freischalten mit E-Mail verifizierung</CommingSoonListItem>
          <CommingSoonListItem>Profilbild Upload</CommingSoonListItem>
          <CommingSoonListItem>YumeKai Chat?!</CommingSoonListItem>
          <CommingSoonListItem>Individuelles Dashboard</CommingSoonListItem>
          <CommingSoonListItem>Rechnungserstellung und Versand</CommingSoonListItem>
          <CommingSoonListItem>Pretix ticketsystem import</CommingSoonListItem>
          <CommingSoonListItem>Sponsoren wo abspeichern</CommingSoonListItem>
          <CommingSoonListItem>
            Nerdquiz liste ink. miniwebseite und Druckoptionen
          </CommingSoonListItem>
          <CommingSoonListItem>
            News auf Dashboard u.a. was ist Aktuell neu oder geändert
          </CommingSoonListItem>
        </ul>
      </SoonContainer>
    </SoonBackground>
  );
}
