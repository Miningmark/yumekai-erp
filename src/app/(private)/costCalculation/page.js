"use client";

import styled from "styled-components";
import { use, useEffect, useState } from "react";
import { socket } from "@/app/socket";

//Components
import { StyledButton } from "@/components/styledComponents/StyledButton";
import { ErrorMessage, SuccessMessage } from "@/components/styledComponents/miscellaneous";

export default function CostCalculation() {
  const [newProjectName, setNewProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  console.log(projects);

  useEffect(() => {
    fetchProjects();

    socket.on("loadNewProjects", fetchProjects);

    return () => {
      socket.off("loadNewProjects", fetchProjects);
    };
  }, []);

  async function fetchProjects() {
    try {
      const response = await fetch("/api/costCalculation");

      if (response.ok) {
        const data = await response.json();
        console.log("DATA", data);
        setProjects(data);
      } else {
        console.error("Fehler beim Laden der Projekte");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function addNewProject() {
    setErrorMessage(null);
    if (newProjectName.trim() === "") {
      setErrorMessage("Projektname darf nicht leer sein");
      return;
    }
    if (projects && projects.some((project) => project.name === newProjectName)) {
      setErrorMessage("Projekt existiert bereits");
      return;
    }

    try {
      const response = await fetch("/api/costCalculation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newProjectName, creator: "test" }),
      });

      if (response.ok) {
        setProjects([...projects, { name: newProjectName, id: Math.random() }]);
        socket.emit("newProject", newProjectName);
      } else {
        setErrorMessage("Fehler beim Erstellen des Projekts");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Kostenkalkulation</h1>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "400px",
            gap: "10px",
          }}
        >
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <input
              type="text"
              placeholder="Projektname"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              style={{ width: "150px" }}
            />
            <StyledButton onClick={() => addNewProject()}>Neue Kalkulation</StyledButton>
          </div>
          {projects.map((project) => (
            <StyledButton key={project.id}>{project.name}</StyledButton>
          ))}
        </div>
      </div>
    </>
  );
}
