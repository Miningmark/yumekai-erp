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
  background-color: ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.textColor};
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

export default function AddNewUser({ handleClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [color, setColor] = useState("#000000");
  const [error, setError] = useState("");
  const [password, setPassword] = useState(generatePassword());

  function generatePassword() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*()_+[]{}|;:',.<>?";

    const allChars = uppercase + lowercase + digits + specialChars;

    function getRandomChar(str) {
      return str[Math.floor(Math.random() * str.length)];
    }

    const passwordArray = [
      getRandomChar(uppercase),
      getRandomChar(lowercase),
      getRandomChar(digits),
      getRandomChar(specialChars),
      ...Array(4)
        .fill(null)
        .map(() => getRandomChar(allChars)),
    ];

    return passwordArray.sort(() => Math.random() - 0.5).join("");
  }

  async function onSubmit() {
    if (!name.trim() || !email.trim() || roles.length === 0) {
      setError("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setError("");

    try {
      const response = await fetch("/api/users/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          roles,
          password,
          color,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      handleClose();
    } catch (error) {
      setError(error.message || "Fehler beim Hinzufügen des Benutzers.");
      //console.error(error);
    }
  }

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRoles([...roles, value]);
    } else {
      setRoles(roles.filter((role) => role !== value));
    }
  };

  return (
    <Overlay onClick={handleClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <h1>Neuen Benutzer Anlegen</h1>
        <p>Name</p>
        <input
          type="text"
          placeholder="e.g. Max Mustermann"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p>E-Mail</p>
        <input
          type="email"
          placeholder="e.g. max@mustermann.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p>Rolle</p>
        <div>
          <label>
            <input type="checkbox" value="1" onChange={handleRoleChange} /> Admin
          </label>
          <label>
            <input type="checkbox" value="2" onChange={handleRoleChange} /> User
          </label>
          <label>
            <input type="checkbox" value="3" onChange={handleRoleChange} /> Orga
          </label>
          <label>
            <input type="checkbox" value="4" onChange={handleRoleChange} /> Social Media
          </label>
        </div>
        <p>Farbe</p>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <p>Password</p>
        <input type="text" value={password} readOnly />
        <ButtonContainer>
          <GreenButton onClick={onSubmit}>Create New User</GreenButton>
        </ButtonContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </FormContainer>
    </Overlay>
  );
}
