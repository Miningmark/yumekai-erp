"use client";

import MenuLayout from "@/components/menu/MenuLayout";
import { useState } from "react";

export default function LayoutLogin({ children }) {
  const [searchtext, setSearchtext] = useState("");

  function handleSerchText(text) {
    setSearchtext(text);
  }

  return (
    <>
      <MenuLayout searchtext={searchtext} handleSerchText={handleSerchText}>
        {children}
      </MenuLayout>
    </>
  );
}
