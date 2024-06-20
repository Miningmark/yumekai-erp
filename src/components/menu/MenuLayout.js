"use client";

import StickyMenu from "@/components/menu/StickyMenu";
import SideMenu from "@/components/menu/SideMenu";
import React, { useState } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";

const Content = styled.div`
  position: absolute;
  left: ${({ $sidemenuwidth }) => `${$sidemenuwidth}px`};
  width: ${({ $sidemenuwidth }) => `calc(100vw - ${$sidemenuwidth}px)`};
  background-color: var(--grey);
  min-height: calc(100vh - 56px);
  padding-top: 56px;
  transition: all 0.3s ease;
`;

export default function MenuLayout({ children }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  const { data: session, update } = useSession();

  console.log("session from menu: ", session);

  return (
    <>
      {!session ? (
        <>{children}</>
      ) : (
        <>
          <SideMenu sideMenuOpen={sideMenuOpen} session={session} />
          <StickyMenu sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
          <Content $sidemenuwidth={sideMenuOpen ? "200" : "60"}>{children}</Content>
        </>
      )}
    </>
  );
}
