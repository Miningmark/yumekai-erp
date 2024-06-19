"use client";

import styled from "styled-components";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

// Import SVG icons
import IconLogo from "/public/assets/icons/yumekai_color_font.svg";
import Icon1 from "/public/assets/icons/dashboard.svg";
import Icon2 from "/public/assets/icons/kanban.svg";
import Icon3 from "/public/assets/icons/settings.svg";
import LogoutIcon from "/public/assets/icons/logout.svg";

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: var(--light);
  width: 200px;
  height: 100%;
  z-index: 2000;
  overflow-x: hidden;
  scrollbar-width: none;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    display: none;
  }

  &.close {
    width: 60px;
  }
`;

const LogoContainer = styled.div`
  position: fixed;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  box-sizing: content-box;
  gap: 20px;

  p {
    font-size: 2.5rem;
    color: var(--primary-color);
    font-weight: bold;
  }
`;

const Logo = styled.div`
  min-width: calc(80px - ((4px + 6px) * 2));
`;

const SideMenuList = styled.ul`
  width: 100%;
  margin-top: 200px;
  list-style: none;
  padding-left: 10px;
`;

const SideMenuItem = styled.li`
  height: 48px;
  background: transparent;
  border-radius: 48px 0 0 48px;
  padding: 4px 10px 4px 4px;
  position: relative;

  &.active {
    background: var(--grey);

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      right: 10px;
      z-index: -1;
    }

    &::before {
      top: -40px;
      box-shadow: 20px 20px 0 var(--grey);
    }

    &::after {
      bottom: -40px;
      box-shadow: 20px -20px 0 var(--grey);
    }

    a {
      color: var(--success);

      svg,
      img {
        fill: var(--success);
      }
    }

    button {
      color: var(--success);

      svg,
      img {
        fill: var(--success);
      }
    }
  }
`;

const SideMenuLink = styled(Link)`
  width: 100%;
  height: 100%;
  background: var(--light);
  display: flex;
  align-items: center;
  border-radius: 24px;
  font-size: 16px;
  color: var(--dark);
  white-space: nowrap;
  overflow-x: hidden;
  transition: all 0.3s ease;
  text-decoration: none;

  svg,
  img {
    min-width: calc(60px - ((4px + 6px) * 2));
    width: 1.4rem; /* Reduced icon size */
    height: 1.4rem; /* Reduced icon size */
    margin-right: 10px;
    padding-left: 3px;
  }

  &.logout {
    color: var(--danger);

    svg,
    img {
      fill: var(--danger); /* Red color for logout icon */
    }
  }
`;

const SideMenuButton = styled.button`
  width: 100%;
  height: 100%;
  background: var(--light);
  display: flex;
  align-items: center;
  border-radius: 48px;
  font-size: 16px;
  color: var(--dark);
  white-space: nowrap;
  overflow-x: hidden;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;

  svg,
  img {
    min-width: calc(60px - ((4px + 6px) * 2));
    width: 1.4rem; /* Reduced icon size */
    height: 1.4rem; /* Reduced icon size */
    margin-right: 10px;
  }

  &.logout {
    color: var(--danger);

    svg,
    img {
      fill: var(--danger); /* Red color for logout icon */
    }
  }
`;

export default function SideMenu({ sideMenuOpen, session }) {
  const pathname = usePathname();

  return (
    <Sidebar className={!sideMenuOpen && "close"}>
      <LogoContainer>
        <Logo>
          <IconLogo />
        </Logo>
        {sideMenuOpen && <p>Orga</p>}
      </LogoContainer>
      <SideMenuList>
        <SideMenuItem className={pathname === "/dashboard" ? "active" : ""}>
          <SideMenuLink href="/dashboard">
            <Icon1 />
            Dashboard
          </SideMenuLink>
        </SideMenuItem>
        <SideMenuItem className={pathname === "/kanban" ? "active" : ""}>
          <SideMenuLink href="/kanban">
            <Icon2 />
            Kanban
          </SideMenuLink>
        </SideMenuItem>
        <SideMenuItem className={pathname === "/settings" ? "active" : ""}>
          <SideMenuLink href="/settings">
            <Icon3 />
            Settings
          </SideMenuLink>
        </SideMenuItem>
        {session.user.role == "admin" && (
          <SideMenuItem className={pathname === "/admin" ? "active" : ""}>
            <SideMenuLink href="/admin">
              <Icon3 />
              admin
            </SideMenuLink>
          </SideMenuItem>
        )}
        <SideMenuItem>
          <SideMenuButton className="logout" onClick={() => signOut()}>
            <LogoutIcon />
            Logout
          </SideMenuButton>
        </SideMenuItem>
      </SideMenuList>
    </Sidebar>
  );
}
