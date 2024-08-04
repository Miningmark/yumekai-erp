"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, login, logout } from "@/lib/cockieFunctions";

//Components
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import {
  LoginIconButton,
  LoginLabel,
  LoginInput,
  LoginInputWrapper,
} from "@/components/styledComponents/LoginComponents";
import ChangePassword from "@/components/profileComponents/ChangePassword";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  color: ${({ theme }) => theme.textColor};
  gap: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const LoginList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 80%;
  max-width: 500px;
`;

const LoginListItem = styled.li`
  background-color: ${({ theme }) => theme.color1};
  padding: 10px;
  margin-bottom: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const AccountChanges = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const ChangeSection = styled.section`
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.color1};
  border-radius: 10px;
  width: 220px;
`;

export default function Home() {
  const [session, setSession] = useState({});
  const [email, setEmail] = useState("");
  const [logins, setLogins] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const newSession = await getSession();
      setSession(newSession);
      setEmail(newSession.user.email);
    }

    checkSession();
  }, []);

  useEffect(() => {
    if (session && session.user && session.user.lastlogins) {
      const parsedLogins = session.user.lastlogins.map((login) => {
        const [date, ip, country, region] = login.split(";");
        return { date: date, ip: ip, country: country, region: region };
      });
      setLogins(parsedLogins);
    }
  }, [session]);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/users/updateEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update email");
      }

      alert("E-Mail erfolgreich aktualisiert");
      handleLogout();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleLogout() {
    const response = await logout();
    if (response) {
      router.push("/");
    }
  }

  return (
    <PageBackground>
      <h1>Profil</h1>
      <AccountChanges>
        <ChangeSection>
          <h2>E-Mail ändern</h2>
          <form onSubmit={handleEmailSubmit}>
            <div>
              <LoginLabel htmlFor="email">Neue E-Mail Adresse</LoginLabel>
              <LoginInput type="email" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <br />
            <GreenButton type="submit">E-Mail ändern</GreenButton>
          </form>
        </ChangeSection>

        <ChangePassword />
      </AccountChanges>

      <Section>
        <h2>Letzte Logins</h2>
        <LoginList>
          {logins.map((login, index) => (
            <LoginListItem key={index}>
              Datum: {login.date} <br /> IP: {login.ip} <br /> Land: {login.country} <br /> Region:{" "}
              {login.region}
            </LoginListItem>
          ))}
        </LoginList>
      </Section>
    </PageBackground>
  );
}
