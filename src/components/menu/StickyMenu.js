import React from "react";
import styled from "styled-components";

// Import SVG icons
import IconMenu from "/public/assets/icons/menu.svg";
import IconSearch from "/public/assets/icons/search.svg";
import IconBrightness from "/public/assets/icons/settings_brightness.svg";
import IconProfile from "/public/assets/icons/account_circle.svg";
import Link from "next/link";

const StyledMenu = styled.nav`
  position: fixed;
  top: 0;
  left: ${({ $sidemenuwidth }) => `${$sidemenuwidth}px`};
  width: ${({ $sidemenuwidth }) => `calc(100vw - ${$sidemenuwidth}px)`};
  height: 56px;
  background-color: ${({ theme }) => theme.color1};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 500;
  transition: all 0.3s ease;

  svg {
    fill: ${({ theme }) => theme.textColor};
  }

  &::before {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    top: 56px;
    left: 0;
    border-radius: 50%;
    box-shadow: -20px -20px 0 ${({ theme }) => theme.color1};
    z-index: -1;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-right: 20px;

  svg {
    height: 40px;
    cursor: pointer;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;

  svg {
    background-color: var(--primary);
    border-radius: 0 20px 20px 0;
  }
`;
const InputField = styled.input`
  background-color: ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.textColor};
  border: transparent;
  border-radius: 20px 0 0 20px;
  padding-left: 20px;
  outline: none;
`;

export default function StickyMenu({
  sideMenuOpen,
  setSideMenuOpen,
  searchtext,
  handleSerchText,
  toggleTheme,
}) {
  return (
    <StyledMenu $sidemenuwidth={sideMenuOpen ? "200" : "60"}>
      <MenuContainer>
        <IconMenu onClick={() => setSideMenuOpen(!sideMenuOpen)} />
        <SearchContainer>
          <InputField
            type="text"
            placeholder="Search..."
            value={searchtext}
            onChange={(e) => {
              handleSerchText(e.target.value);
            }}
          />
          <IconSearch />
        </SearchContainer>
      </MenuContainer>
      <MenuContainer>
        <IconBrightness onClick={toggleTheme} />
        <Link href="/profile">
          <IconProfile />
        </Link>
      </MenuContainer>
    </StyledMenu>
  );
}
