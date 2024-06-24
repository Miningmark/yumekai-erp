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

export default function Login() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    //TODO: prüfen nicht leere eingaben

    const response = await login({ name: name, password: password });
    console.log("response from login", response);
    if (response) {
      router.push("/");
      //redirect("/dashboard");
    }
  }

  const handleCredentials = async (prevState, formData) => {
    const response = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!!response.error) {
      setModal(true);
      setErrorMessage("Incorrect Username or Password");
      console.log(response.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <ContainerBgmLogin>
      <h1>Login Page</h1>
      <form>
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

        {errorMessage && (
          <div id="alert-2" role="alert">
            <span>Info</span>
            <div>{errorMessage}</div>
          </div>
        )}

        <StyledButton onClick={(event) => handleSubmit(event)}>Submit</StyledButton>
      </form>
    </ContainerBgmLogin>
  );
}
