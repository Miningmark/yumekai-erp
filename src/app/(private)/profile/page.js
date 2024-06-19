"use client";

import { useSession, getSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import { useEffect, useRef, useState } from "react";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  color: var(--dark);
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
`;

const LoginListItem = styled.li`
  background-color: var(--light);
  padding: 10px;
  margin-bottom: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default function Home() {
  const { data: session, update } = useSession();
  const [email, setEmail] = useState(session?.user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [logins, setLogins] = useState([]);

  useEffect(() => {
    // Hier sollten die letzten Logins von einer API abgerufen werden
    setLogins([
      { date: "2024-06-15 10:00", location: "Berlin" },
      { date: "2024-06-14 18:00", location: "Munich" },
      { date: "2024-06-13 08:00", location: "Hamburg" },
    ]);
  }, []);

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

      //console.log("ALT session from profile: ", session);
      //update({ ...session.user, email: email });
      //console.log("sollte: ", { ...session.user, email: email });
      //console.log("NEU session from profile: ", session);

      alert("E-Mail erfolgreich aktualisiert");
      signOut();
    } catch (error) {
      alert(error.message);
    }
  };

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
      <Section>
        <h2>E-Mail ändern</h2>
        <form onSubmit={handleEmailSubmit}>
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input type="email" id="email" value={email} onChange={handleEmailChange} />
          </div>
          <GreenButton type="submit">E-Mail ändern</GreenButton>
        </form>
      </Section>
      <Section>
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
      </Section>
      <Section>
        <h2>Letzte Logins</h2>
        <LoginList>
          {logins.map((login, index) => (
            <LoginListItem key={index}>
              {login.date} - {login.location}
            </LoginListItem>
          ))}
        </LoginList>
      </Section>
    </PageBackground>
  );
}
