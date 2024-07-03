"use client";

import StickyMenu from "@/components/menu/StickyMenu";
import SideMenu from "@/components/menu/SideMenu";
import { useEffect, useState } from "react";
import styled from "styled-components";
import React from "react";

const Content = styled.div`
  position: absolute;
  left: ${({ $sidemenuwidth }) => `${$sidemenuwidth}px`};
  width: ${({ $sidemenuwidth }) => `calc(100vw - ${$sidemenuwidth}px)`};
  background-color: var(--grey);
  min-height: calc(100vh - 56px);
  padding-top: 56px;
  transition: all 0.3s ease;
`;

export const PageContext = React.createContext(null);

export default function MenuLayout({ children, searchtext, handleSerchText, toggleTheme }) {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);

  // Clone children and pass searchtext as a prop
  const childrenWithProps = React.Children.map(children, (child) => {
    // Check if child is a valid React element
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { searchtext });
    }
    return child;
  });

  return (
    <>
      <SideMenu sideMenuOpen={sideMenuOpen} />
      <StickyMenu
        sideMenuOpen={sideMenuOpen}
        setSideMenuOpen={setSideMenuOpen}
        searchtext={searchtext}
        handleSerchText={handleSerchText}
        toggleTheme={toggleTheme}
      />
      <Content $sidemenuwidth={sideMenuOpen ? "200" : "60"}>
        <PageContext.Provider value={searchtext}>{children}</PageContext.Provider>
      </Content>
    </>
  );
}
