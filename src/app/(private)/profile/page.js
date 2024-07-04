"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, login, logout } from "@/lib/cockieFunctions";

import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import {
  LoginIconButton,
  LoginLabel,
  LoginInput,
  LoginInputWrapper,
} from "@/components/styledComponents/LoginComponents";

// Import SVG icons
import IconVisible from "/public/assets/icons/visibility.svg";
import IconVisibleOff from "/public/assets/icons/visibility_off.svg";

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

const ToggleButton = styled.button`
  margin-left: 10px;
  padding: 6px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.textColor};
`;

const PasswordRequirement = styled.div`
  color: ${(props) => props.$requirement};
  font-size: 0.9em;
`;

const PasswordRequirements = ({ password }) => {
  const requirements = [
    {
      text: "min. 8 Zeichen lang",
      requirement: password.length >= 8,
    },
    {
      text: "min. 1 Sonderzeichen ",
      requirement: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
    {
      text: "min. 1 Zahl",
      requirement: /\d/.test(password),
    },
  ];

  return (
    <div>
      {requirements.map((req, index) => (
        <PasswordRequirement
          key={index}
          $requirement={req.requirement ? "var(--success)" : "var(--danger)"}
        >
          {req.text}
        </PasswordRequirement>
      ))}
    </div>
  );
};

export default function Home() {
  const [session, setSession] = useState({});
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [logins, setLogins] = useState([]);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <PageBackground>
      <h1>Profil</h1>
      <AccountChanges>
        <ChangeSection>
          <h2>E-Mail ändern</h2>
          <form onSubmit={handleEmailSubmit}>
            <div>
              <LoginLabel htmlFor="email">E-Mail</LoginLabel>
              <LoginInput type="email" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <br />
            <GreenButton type="submit">E-Mail ändern</GreenButton>
          </form>
        </ChangeSection>

        <ChangeSection>
          <h2>Passwort ändern</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div>
              <LoginLabel htmlFor="currentPassword">Aktuelles Passwort</LoginLabel>
              <LoginInputWrapper>
                <LoginInput
                  type={showOldPassword ? "text" : "password"}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                />
                <LoginIconButton
                  type="button"
                  onClick={() => {
                    setShowOldPassword(!showOldPassword);
                  }}
                >
                  {showOldPassword ? <IconVisibleOff /> : <IconVisible />}
                </LoginIconButton>
              </LoginInputWrapper>
            </div>
            <br />
            <div>
              <LoginLabel htmlFor="newPassword">Neues Passwort</LoginLabel>
              <LoginInputWrapper>
                <LoginInput
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                />
                <LoginIconButton
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <IconVisibleOff /> : <IconVisible />}
                </LoginIconButton>
              </LoginInputWrapper>
              <PasswordRequirements password={newPassword} />
            </div>
            <br />

            <div>
              <LoginLabel htmlFor="confirmNewPassword">Neues Passwort bestätigen</LoginLabel>
              <LoginInputWrapper>
                <LoginInput
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={handleConfirmNewPasswordChange}
                />
                <LoginIconButton
                  type="button"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                >
                  {showConfirmPassword ? <IconVisibleOff /> : <IconVisible />}
                </LoginIconButton>
              </LoginInputWrapper>
            </div>
            <br />
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
