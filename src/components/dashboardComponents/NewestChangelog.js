"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { changelog } from "@/lib/changelogList";

const LatestLogContainer = styled.div`
  width: 300px;
  padding: 20px;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  border-radius: var(--border-radius);
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    margin: 0;
    padding: 10px;
    text-align: center;
  }

  p {
    margin: 0;
  }
`;

const LogDetails = styled.div`
  background-color: ${({ theme }) => theme.color2};
  border-radius: var(--border-radius);
  padding: 10px;
`;

export default function LatestChangelog() {
  const [latestLog, setLatestLog] = useState(changelog[0]);

  if (!latestLog) {
    return <p>Loading...</p>;
  }

  return (
    <LatestLogContainer>
      <h2>Latest Changelog</h2>
      <LogDetails>
        <h3>{latestLog.title}</h3>
        <p>
          <strong>Version:</strong> {latestLog.version}
        </p>
        <ul>
          {latestLog.updates.map((update, idx) => (
            <li key={idx}>{update}</li>
          ))}
        </ul>
      </LogDetails>
    </LatestLogContainer>
  );
}
