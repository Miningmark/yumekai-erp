"use client";

import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getSession, login, logout } from "@/lib/cockietest";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  color: var(--dark);
  gap: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const LoginList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 80%;
  max-width: 500px;
`;

const LoginListItem = styled.li`
  background-color: var(--light);
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
  background-color: var(--light);
  border-radius: 10px;
  width: 220px;
`;

export default function Home() {
  const [session, setSession] = useState({});
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
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
  console.log("session from profile page: ", session);

  useEffect(() => {
    if (session && session.user && session.user.lastlogins) {
      const parsedLogins = session.user.lastlogins.map((login) => {
        const [date, ip] = login.split(";");
        return { date: date, location: ip.trim() };
      });
      setLogins(parsedLogins);
    }
  }, [session]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("credentials");
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
  };

  async function handleLogout() {
    const response = await logout();
    if (response) {
      router.push("/");
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Das neue Passwort und die Bestätigung stimmen nicht überein.");
      return;
    }

    try {
      const response = await fetch("/api/users/updatePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      alert("Passwort erfolgreich aktualisiert");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <PageBackground>
      <h1>Profil</h1>
      <AccountChanges>
        <ChangeSection>
          <h2>E-Mail ändern</h2>
          <form onSubmit={handleEmailSubmit}>
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input type="email" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <GreenButton type="submit">E-Mail ändern</GreenButton>
          </form>
        </ChangeSection>
        <ChangeSection>
          <h2>Passwort ändern</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div>
              <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
              <Input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
              />
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Neues Passwort bestätigen</Label>
              <Input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
              />
            </div>
            <GreenButton type="submit">Passwort ändern</GreenButton>
          </form>
        </ChangeSection>
      </AccountChanges>
      <Section>
        <h2>Letzte Logins</h2>
        <LoginList>
          {logins.map((login, index) => (
            <LoginListItem key={index}>
              Datum: {login.date} <br /> IP: {login.location}
            </LoginListItem>
          ))}
        </LoginList>
      </Section>
    </PageBackground>
  );
}
