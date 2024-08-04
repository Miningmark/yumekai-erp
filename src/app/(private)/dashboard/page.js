"use client";

import styled from "styled-components";
import { useState } from "react";
import NextFiveConventions from "@/components/dashboardComponents/NextFiveConventions";
import EMailSend from "@/components/dashboardComponents/EMailSend";
import NewestChangelog from "@/components/dashboardComponents/NewestChangelog";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

export default function DashBoard() {
  return (
    <>
      <h1>Dashboard</h1>
      <DashboardContainer>
        <EMailSend />
        <NextFiveConventions />
        <NewestChangelog />
      </DashboardContainer>
    </>
  );
}
