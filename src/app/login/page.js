"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { redirect } from "next/navigation";

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

const ContainerBgmLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  padding: 0 2rem;
  background-color: var(--light);
  color: var(--dark);
  gap: 20px;
`;

const LoginError = styled.p`
  color: var(--danger);
  text-align: center;
`;
const PageInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "" || password.trim() === "") {
      setErrorMessage("Bitte geben Sie ihren Benutzernamen und Password an.");
      return;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, password: password }),
    });
    /**
      headers: {
        "Content-Type": "application/json",
        "Referrer-Policy": "no-referrer-when-downgrade",
      },
     */

    if (response.ok) {
      router.push("/dashboard");
    } else {
      setErrorMessage("Incorrect Username or Password");
      console.error("response from loginpage", response);
    }
  }

  return (
    <ContainerBgmLogin>
      <h1>Login Page</h1>
      <PageInputWrapper>
        <LoginLabel htmlFor="username">Username: </LoginLabel>
        <LoginInput
          type="text"
          name="username"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </PageInputWrapper>
      <PageInputWrapper>
        <LoginLabel htmlFor="password">Password: </LoginLabel>
        <LoginInputWrapper>
          <LoginInput
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </PageInputWrapper>

      {errorMessage && <LoginError>{errorMessage}</LoginError>}

      <StyledButton onClick={(event) => handleSubmit(event)}>Submit</StyledButton>
    </ContainerBgmLogin>
  );
}
