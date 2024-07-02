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

const CummingSoonListItem = styled.li`
  padding-bottom: 5px;
`;

export default function CommingSoon() {
  return (
    <SoonBackground>
      <h1>Comming Soon</h1>
      <SoonContainer>
        <ul>
          <CummingSoonListItem>Kostenkalkulation</CummingSoonListItem>
          <CummingSoonListItem>Ehrengäste Zeitplan</CummingSoonListItem>
          <CummingSoonListItem>Verschiedene Automatismen</CummingSoonListItem>
          <CummingSoonListItem>Benachrichtigungen</CummingSoonListItem>
          <CummingSoonListItem>E-Mail sender</CummingSoonListItem>
          <CummingSoonListItem>Einstellungen</CummingSoonListItem>
          <CummingSoonListItem>Suchfunktion für Kanbanboard</CummingSoonListItem>
          <CummingSoonListItem>Smartphone Support</CummingSoonListItem>
          <CummingSoonListItem>Lightmode</CummingSoonListItem>
          <CummingSoonListItem>Passwort zurücksetzen</CummingSoonListItem>
          <CummingSoonListItem>Farb Legende für Kanban Board</CummingSoonListItem>
          <CummingSoonListItem>
            Last logins auf Profilseite IP fixen und reihenfolge ändern neu zu alt
          </CummingSoonListItem>
          <CummingSoonListItem>Admin Page überarbeiten</CummingSoonListItem>
        </ul>
      </SoonContainer>
    </SoonBackground>
  );
}
