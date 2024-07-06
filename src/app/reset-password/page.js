"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import {
  LoginIconButton,
  LoginLabel,
  LoginInput,
  LoginInputWrapper,
} from "@/components/styledComponents/LoginComponents";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

// Import SVG icons
import IconVisible from "/public/assets/icons/visibility.svg";
import IconVisibleOff from "/public/assets/icons/visibility_off.svg";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  gap: 20px;
  width: 100vw;
  height: 100vh;
`;

const LoginError = styled.p`
  color: var(--danger);
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

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Passwörter nicht identisch");
      return;
    }

    const response = await fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (response.ok) {
      alert("Passwort Erfolgreich geändert");
      router.push("/login");
    } else {
      const data = await response.json();
      setErrorMessage(data.message || "Error resetting password");
    }
  }

  function handleNewPasswordChange(event) {
    setNewPassword(event.target.value);
  }

  function handleConfirmNewPasswordChange(event) {
    setConfirmNewPassword(event.target.value);
  }

  return (
    <PageBackground>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
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
        {errorMessage && <LoginError>{errorMessage}</LoginError>}
        <GreenButton type="submit">Passwort Speichern</GreenButton>
      </form>
    </PageBackground>
  );
}
