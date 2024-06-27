"use client";

import styled from "styled-components";
import {
  StyledButton,
  GreenButton,
  RedButton,
  DisabledGreenButton,
} from "@/components/styledComponents/StyledButton";
import { useState, useEffect, useRef } from "react";

import { getSession, login, logout } from "@/lib/cockieFunctions";
import CharacterCount from "@/components/styledComponents/CharacterCount";
import {
  ModalOverlay,
  ModalInputField,
  ModalTextArea,
  ModalSubtaskInput,
  ModalButtonRightContainer,
  ModalContent,
  ModalCloseIcon,
  ModalImputTitle,
} from "@/components/styledComponents/ModalComponents";

const FormContainer = styled.div`
  color: var(--dark);
  background-color: var(--light);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 50px;

  h1 {
    padding-top: 0;
  }
`;

export default function BugReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function loadSession() {
      setSession(await getSession());
    }

    loadSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setMessage("Bitte geben Sie einen Titel ein.");
      return;
    }

    if (!description.trim()) {
      setMessage("Bitte geben Sie eine Beschreibung ein.");
      return;
    }

    const response = await fetch("/api/bugReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, reporter: session?.user?.name || "Unknown" }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
      setTitle("");
      setDescription("");
    }
  };

  if (!session) {
    return <p>Loading</p>;
  }

  return (
    <FormContainer>
      <h1>Bug Report</h1>
      <form onSubmit={handleSubmit}>
        <ModalImputTitle>Titel (max. 50 zeichen)</ModalImputTitle>
        <ModalInputField
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={51}
        />
        <CharacterCount $tooLong={title.length > 50 ? "var(--danger)" : "var(--dark)"}>
          {title.length}/50 Zeichen
        </CharacterCount>
        <ModalImputTitle>Beschreibung (max. 500 zeichen)</ModalImputTitle>
        <ModalTextArea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="6"
          maxLength={501}
        />
        <CharacterCount $tooLong={description.length > 500 ? "var(--danger)" : "var(--dark)"}>
          {description.length}/500 Zeichen
        </CharacterCount>
        <ModalButtonRightContainer>
          {title.length > 50 ||
          title.length == 0 ||
          description.length > 500 ||
          description.length == 0 ? (
            <DisabledGreenButton disabled>Senden</DisabledGreenButton>
          ) : (
            <GreenButton onClick={handleSubmit}>Senden</GreenButton>
          )}
        </ModalButtonRightContainer>
      </form>
      {message && <p>{message}</p>}
    </FormContainer>
  );
}
