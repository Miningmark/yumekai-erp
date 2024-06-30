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
        <h2>Add new Pages and Functions</h2>
        <VersionsNumber>V 0.2</VersionsNumber>
        <ul>
          <li>Add Contact Page</li>
          <li>Add Password show Buttons</li>
          <li>Add Password guidelines</li>
          <li>Add Delete subtasks when creating a task</li>
          <li>Fix Tasks without subtasks suddenly have 1 subtask</li>
        </ul>
      </LogContainer>
      <LogContainer>
        <h2>Initiale Version</h2>
        <VersionsNumber>V 0.1</VersionsNumber>
        <ul>
          <li>Add Profilepage with E-Mail and Password change</li>
          <li>Add Kanbanboard</li>
          <li>Add Adminboard</li>
          <li>Add Changelog</li>
          <li>Add Comming Soon</li>
          <li>Add Bug Report</li>
          <li>Add YumeKai Umfrage Auswertung</li>
        </ul>
      </LogContainer>
    </LogBackground>
  );
}