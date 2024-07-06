"use client";

import styled from "styled-components";
import { StyledButton } from "@/components/styledComponents/StyledButton";
import { useRouter } from "next/navigation";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  width: 100vw;
  height: 100vh;
`;

export default function DashBoard() {
  const router = useRouter();

  return (
    <PageBackground>
      <h1>Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <StyledButton
        onClick={() => {
          router.push("/dashboard");
        }}
      >
        zum Dashboard
      </StyledButton>
    </PageBackground>
  );
}
