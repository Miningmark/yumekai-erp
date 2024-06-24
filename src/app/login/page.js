"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

import { getSession, login, logout } from "@/lib/cockietest";
import { redirect } from "next/navigation";

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

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (name.trim() === "" || password.trim() === "") {
      setErrorMessage("Please fill in both fields.");
      return;
    }

    const response = await login({ name: name, password: password });
    console.log("response from login", response);
    if (response) {
      router.push("/dashboard");
      //redirect("/dashboard");
    } else {
      setErrorMessage("Incorrect Username or Password");
      console.log(response.error);
    }
  }

  return (
    <ContainerBgmLogin>
      <h1>Login Page</h1>
      <h3>afgagfaf</h3>
      <div>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
      </div>

      {errorMessage && <LoginError>{errorMessage}</LoginError>}

      <StyledButton onClick={(event) => handleSubmit(event)}>Submit</StyledButton>
    </ContainerBgmLogin>
  );
}
