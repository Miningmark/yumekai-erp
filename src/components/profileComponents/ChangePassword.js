"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";

//Components
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
import {
  LoginIconButton,
  LoginLabel,
  LoginInput,
  LoginInputWrapper,
} from "@/components/styledComponents/LoginComponents";
import PasswordRequirements from "@/components/miscellaneous/PasswordRequirements";
import { ErrorMessage, SuccessMessage } from "@/components/styledComponents/miscellaneous";

// Import SVG icons
import IconVisible from "/public/assets/icons/visibility.svg";
import IconVisibleOff from "/public/assets/icons/visibility_off.svg";

const ChangePasswordWrapper = styled.div`
  padding: 0 20px 20px 20px;
  background-color: ${({ theme }) => theme.color1};
  border-radius: 10px;
  width: 220px;
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

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function handleCurrentPasswordChange(event) {
    setCurrentPassword(event.target.value);
  }

  function handleNewPasswordChange(event) {
    setNewPassword(event.target.value);
  }

  function handleConfirmNewPasswordChange(event) {
    setConfirmNewPassword(event.target.value);
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    if (currentPassword === "") {
      setError("Bitte gib dein aktuelles Passwort ein.");
      return;
    }

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
        throw new Error(data.message || "Fehler beim Aktualisieren des Passworts");
      }

      alert("Passwort erfolgreich aktualisiert");
    } catch (error) {
      //alert(error.message);
      setError(error.message);
      return;
    }
    setSuccess("Passwort erfolgreich aktualisiert");
  }

  return (
    <ChangePasswordWrapper>
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
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        <GreenButton type="submit">Passwort ändern</GreenButton>
      </form>
    </ChangePasswordWrapper>
  );
}
