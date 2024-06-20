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
        </ul>
      </SoonContainer>
    </SoonBackground>
  );
}
