"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";

const BugPage = styled.div`
  background-color: var(--light);
  border-radius: 10px;
  color: var(--dark);
  margin: 20px;
  padding-bottom: 20px;

  h2 {
    text-align: center;
  }
`;

const BugContainer = styled.div`
  height: 330px;
  overflow-y: auto;
`;

const BugList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BugListItem = styled.li`
  border: 1px solid #ccc;
  padding: 0 10px;
  border-radius: 5px;
  margin: 0 20px;
  background-color: var(--grey);
`;

export default function BugModule() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch("/api/bugReport");
        if (response.ok) {
          const data = await response.json();
          setBugs(data);
        } else {
          console.error("Failed to fetch bug reports");
        }
      } catch (error) {
        console.error("Error fetching bug reports", error);
      }
    };
    fetchBugs();
  }, []);
  return (
    <BugPage>
      <br />
      <h2>Reported Bugs</h2>
      <BugContainer>
        <BugList>
          {bugs.map((bug) => (
            <BugListItem key={bug.id}>
              <h3>{bug.title}</h3>
              <p>{bug.description}</p>
              <p>
                Gemeldet von: {bug.reporter} am: {new Date(bug.created_at).toLocaleString("de-DE")}
              </p>
            </BugListItem>
          ))}
        </BugList>
      </BugContainer>
    </BugPage>
  );
}
