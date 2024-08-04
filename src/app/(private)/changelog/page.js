"use client";

import styled from "styled-components";

import { changelog } from "@/lib/changelogList";

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
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
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
      {changelog.map((log, index) => (
        <LogContainer key={index}>
          <h2>{log.title}</h2>
          <VersionsNumber>{log.version}</VersionsNumber>
          <ul>
            {log.updates.map((update, idx) => (
              <li key={idx}>{update}</li>
            ))}
          </ul>
        </LogContainer>
      ))}
    </LogBackground>
  );
}
