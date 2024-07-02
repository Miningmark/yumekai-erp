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
import BugModule from "@/components/bugReport/BugModule";
import { socket } from "@/app/socket";

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

function formatierteZeit() {
  let jetzt = new Date();

  // Datumskomponenten extrahieren
  let tag = jetzt.getDate();
  let monat = jetzt.getMonth() + 1; // Monate sind 0-basiert, daher +1
  let jahr = jetzt.getFullYear();

  // Zeitkomponenten extrahieren
  let stunden = jetzt.getHours();
  let minuten = jetzt.getMinutes();
  let sekunden = jetzt.getSeconds();

  // Führende Nullen hinzufügen, falls nötig
  tag = (tag < 10 ? "0" : "") + tag;
  monat = (monat < 10 ? "0" : "") + monat;
  stunden = (stunden < 10 ? "0" : "") + stunden;
  minuten = (minuten < 10 ? "0" : "") + minuten;
  sekunden = (sekunden < 10 ? "0" : "") + sekunden;

  // Das gewünschte Format erstellen
  return `${tag}.${monat}.${jahr}, ${stunden}:${minuten}:${sekunden}`;
}

export default function BugReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [session, setSession] = useState(null);
  const [bugs, setBugs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    fetchBugs();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("loadNewBug", fetchBugs);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("loadNewBug", fetchBugs);
    };
  }, []);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
  }, [socket.connected]);

  function onConnect() {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }

  function onDisconnect() {
    setIsConnected(false);
    setTransport("N/A");
  }

  useEffect(() => {
    async function checkSession() {
      setSession(await getSession());
    }

    checkSession();
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
      setBugs([
        ...bugs,
        {
          title: title,
          description: description,
          reporter: session?.user?.name || "Unknown",
          created_at: formatierteZeit(),
        },
      ]);
      socket.emit("newBug", "Hello Server");
      setTitle("");
      setDescription("");
    }
  };

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
      <BugModule bugs={bugs} />
    </>
  );
}
