"use client";
import styled from "styled-components";

const LogBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const LogContainer = styled.div`
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
const VersionsNumber = styled.p`
  position: absolute;
  right: 30px;
  top: 10px;
`;

export default function Changelog() {
  return (
    <LogBackground>
      <h1>Changelog</h1>
      <LogContainer>
        <h2>Initiale Version</h2>
        <VersionsNumber>V 0.1</VersionsNumber>
        <ul>
          <li>Add Profilepage with E-Mail and Password chnage</li>
          <li>Add Kanbanboard</li>
          <li>Add Adminboard</li>
          <li>Add Changelog</li>
          <li>Add Comming Soon</li>
          <li>Add Bug Report</li>
        </ul>
      </LogContainer>
    </LogBackground>
  );
}
