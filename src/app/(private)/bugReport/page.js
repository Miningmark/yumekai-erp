"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const CharacterCounter = styled.p`
  color: ${(props) => props.$limitExceeded};
`;

export default function BugReport() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

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

  return (
    <FormContainer>
      <h1>Bug Report</h1>
      <form onSubmit={handleSubmit}>
        <p>Titel (max. 50 zeichen)</p>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 50))}
        />
        <p>Beschreibung (max. 500 zeichen)</p>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 500))}
          rows="4"
        />
        <CharacterCounter $limitExceeded={description.length >= 500 ? "red" : "inherit"}>
          {description.length}/500 Zeichen
        </CharacterCounter>
        <ButtonContainer>
          <StyledButton type="submit">Senden</StyledButton>
        </ButtonContainer>
      </form>
      {message && <p>{message}</p>}
    </FormContainer>
  );
}
