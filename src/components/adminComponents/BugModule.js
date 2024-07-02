"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { socket } from "@/app/socket";
import { getSession, login, logout } from "@/lib/cockieFunctions";

const BugPage = styled.div`
  background-color: var(--light);
  border-radius: 10px;
  color: var(--dark);
  margin: 20px;
  padding-bottom: 20px;

  h2 {
    text-align: center;
  }
`;

const BugContainer = styled.div`
  height: 330px;
  overflow-y: auto;
`;

const BugList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BugListItem = styled.li`
  position: relative;
  border: 1px solid #ccc;
  padding: 0 10px;
  border-radius: 5px;
  margin: 0 20px;
  background-color: var(--grey);
`;

const CheckboxContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  transform: scale(2.5);
`;

export default function BugModule() {
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

  /*
  useEffect(() => {
    const fetchBugs = async () => {
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
    };
    fetchBugs();
  }, []);
*/

  console.log(bugs);

  const handleCheckboxChange = async (bugId, currentValue) => {
    try {
      const response = await fetch(`/api/bugReport`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: bugId, finished: !currentValue }),
      });
      if (response.ok) {
        setBugs((prevBugs) =>
          prevBugs.map((bug) => (bug.id === bugId ? { ...bug, finished: !currentValue } : bug))
        );
        socket.emit("newBug", "Hello Server");
      } else {
        console.error("Failed to update bug report");
      }
    } catch (error) {
      console.error("Error updating bug report", error);
    }
  };

  return (
    <BugPage>
      <br />
      <h2>Reported Bugs</h2>
      <BugContainer>
        <BugList>
          {bugs.map((bug) => (
            <BugListItem key={bug.id}>
              <CheckboxContainer>
                <input
                  type="checkbox"
                  checked={bug.finished}
                  onChange={() => handleCheckboxChange(bug.id, bug.finished)}
                />
              </CheckboxContainer>
              <h3>{bug.title}</h3>
              <p>{bug.description}</p>
              <p>
                Gemeldet von: {bug.reporter} am: {new Date(bug.created_at).toLocaleString("de-DE")}
              </p>
            </BugListItem>
          ))}
        </BugList>
      </BugContainer>
    </BugPage>
  );
}
