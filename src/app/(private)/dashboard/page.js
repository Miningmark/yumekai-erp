"use client";

import styled from "styled-components";
import { useState } from "react";
import NextFiveConventions from "@/components/dashboardComponents/NextFiveConventions";
import EMailSend from "@/components/dashboardComponents/EMailSend";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export default function DashBoard() {
  return (
    <>
      <h1>Dashboard</h1>
      <DashboardContainer>
        <EMailSend />
        <NextFiveConventions />
      </DashboardContainer>
    </>
  );
}
