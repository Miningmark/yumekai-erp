"use client";

import styled from "styled-components";

const StyledTExt12 = styled.p`
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  z-index: 1000;
  position: fixed;
  top: 100px;
`;

export default function DashBoard() {
  return (
    <>
      <h1>Dashboard</h1>
      <StyledTExt12>Test text</StyledTExt12>
    </>
  );
}
