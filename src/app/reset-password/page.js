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
import PasswordRequirements from "@/components/miscellaneous/PasswordRequirements";
import { ErrorMessage, SuccessMessage } from "@/components/styledComponents/miscellaneous";

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

function isMinimumLength(password) {
  return password.length >= 8;
}

function hasSpecialCharacter(password) {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
}

function hasNumber(password) {
  return /\d/.test(password);
}

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    setError(null);
    setSuccess(null);

    if (!isMinimumLength(newPassword)) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    if (!hasSpecialCharacter(newPassword)) {
      setError("Das Passwort muss mindestens ein Sonderzeichen enthalten.");
      return;
    }

    if (!hasNumber(newPassword)) {
      setError("Das Passwort muss mindestens eine Zahl enthalten.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Das neue Passwort und die Bestätigung stimmen nicht überein.");
      return;
    }

    const response = await fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password: newPassword }),
    });

    if (response.ok) {
      setSuccess("Passwort erfolgreich aktualisiert");
      router.push("/login");
    } else {
      setError("Server Fehler. Bitte versuche es später erneut.");
      return;
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

      <form style={{ width: "300px" }} onSubmit={handleSubmit}>
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <GreenButton type="submit">Passwort Speichern</GreenButton>
      </form>
    </PageBackground>
  );
}
