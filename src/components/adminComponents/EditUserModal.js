import { useState } from "react";
import styled from "styled-components";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const FormContainer = styled.div`
  color: var(--dark);
  background-color: var(--grey);
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
`;

export default function EditUserModal({ user, handleClose, handleUpdateUsers, users }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [color, setColor] = useState(user.color);
  const [error, setError] = useState("");

  async function handleSubmit() {
    // Check if the new name is unique
    const isNameUnique = users.every((u) => u.id === user.id || u.name !== name);
    if (!isNameUnique) {
      console.log(users);
      console.log(user);
      setError("Der Benutzername ist bereits vergeben.");
      return;
    }

    // Update the user
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
          color,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, name, email, role, color } : u
      );

      handleUpdateUsers(updatedUsers);
      handleClose();
    } catch (error) {
      setError(error.message || "Fehler beim Bearbeiten des Benutzers.");
      console.error(error);
    }
  }

  return (
    <Overlay onClick={handleClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <h1>Bearbeite Benutzer</h1>
        <p>Name</p>
        <input
          type="text"
          placeholder="z. B. Max Mustermann"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>Email</p>
        <input
          type="email"
          placeholder="z. B. max@mustermann.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>Rolle</p>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Benutzer</option>
          <option value="orga">Orga</option>
          <option value="admin">Admin</option>
        </select>
        <p>Color</p>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <ButtonContainer>
          <RedButton onClick={handleClose}>Abbrechen</RedButton>
          <GreenButton onClick={handleSubmit}>Aktualisieren</GreenButton>
        </ButtonContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
    </Overlay>
  );
}
