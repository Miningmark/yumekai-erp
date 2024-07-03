"use client";

import MenuLayout from "@/components/menu/MenuLayout";
import { useState } from "react";
import React from "react";
import { PageContext } from "@/app/ThemeWrapper";

export default function LayoutLogin({ children }) {
  const [searchtext, setSearchtext] = useState("");

  const toggleTheme = React.useContext(PageContext);

  function handleSerchText(text) {
    setSearchtext(text);
  }

  return (
    <>
      <MenuLayout
        searchtext={searchtext}
        handleSerchText={handleSerchText}
        toggleTheme={toggleTheme}
      >
        {children}
      </MenuLayout>
    </>
  );
}
