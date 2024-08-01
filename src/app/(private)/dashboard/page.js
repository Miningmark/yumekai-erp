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
  async function test() {
    const response = await fetch("/api/aaa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  }
  return (
    <>
      <h1>Dashboard</h1>
      <DashboardContainer>
        <EMailSend />
        <NextFiveConventions />
        <button onClick={test}>Test</button>
      </DashboardContainer>
    </>
  );
}
