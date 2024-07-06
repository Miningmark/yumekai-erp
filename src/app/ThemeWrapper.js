"use client";

import { GlobalStyles } from "@/lib/global-styles";
import StyledComponentsRegistry from "@/lib/styled-components-registry";
import { useState } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import React from "react";

const StyledTExt1 = styled.p`
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  z-index: 1000;
  position: fixed;
  top: 100px;
`;

export const PageContext = React.createContext(null);

export default function ThemeWrapper({ children }) {
  const [themeMode, setThemeMode] = useState("dark");

  const toggleTheme = () => {
    setThemeMode(themeMode === "light" ? "dark" : "light");
  };

  const theme = {
    light: {
      textColor: "#363949",
      color1: "#f6f6f9",
      color2: "#eee",
    },
    dark: {
      textColor: "#fbfbfb",
      color1: "#181a1e", //light
      color2: "#25252c", //grey
    },
  };
  /*
  const childrenWithProps = React.Children.map(children, (child) => {
    // Check if child is a valid React element
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { toggleTheme });
    }
    return child;
  });
*/
  return (
    <>
      <ThemeProvider theme={theme[themeMode]}>
        <GlobalStyles />
        <StyledComponentsRegistry>
          <PageContext.Provider value={toggleTheme}>{children}</PageContext.Provider>
        </StyledComponentsRegistry>
      </ThemeProvider>
    </>
  );
}
