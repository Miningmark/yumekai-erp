"use client";

import styled from "styled-components";
import { GreenButton, DisabledGreenButton } from "@/components/styledComponents/StyledButton";
import { useState, useEffect } from "react";

import { getSession } from "@/lib/cockieFunctions";
import CharacterCount from "@/components/styledComponents/CharacterCount";
import {
  ModalInputField,
  ModalTextArea,
  ModalButtonRightContainer,
  ModalImputTitle,
} from "@/components/styledComponents/ModalComponents";
import BugModule from "@/components/bugReport/BugModule";
import { socket } from "@/app/socket";

const FormContainer = styled.div`
  color: ${({ theme }) => theme.textColor};
  background-color: ${({ theme }) => theme.color1};
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
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    async function loadSession() {
      setSession(await getSession());
    }

    loadSession();
    fetchBugs();

    socket.on("loadNewBug", fetchBugs);

    return () => {
      socket.off("loadNewBug", fetchBugs);
    };
  }, []);

  async function fetchBugs() {
    try {
      const response = await fetch("/api/bugReport");
      if (response.ok) {
        const data = await response.json();
        setBugs(data);
      } else {
        console.error("Failed to fetch bug reports");
      }
    } catch (error) {
      console.error("Error fetching bug reports", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formattedDate = new Date()
      .toLocaleString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "");

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
      setBugs([
        ...bugs,
        {
          title: title,
          description: description,
          reporter: session?.user?.name || "Unknown",
          created_at: formattedDate,
        },
      ]);
      socket.emit("newBug", "Hello Server");
      setTitle("");
      setDescription("");
    }
  }

  if (!session) {
    return <p>Loading</p>;
  }

  return (
    <>
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
          <CharacterCount $tooLong={title.length > 50 ? 1 : 0}>
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
          <CharacterCount $tooLong={description.length > 500 ? 1 : 0}>
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
      <BugModule bugs={bugs} />
    </>
  );
}
