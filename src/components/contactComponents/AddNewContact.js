"use client";

import { useState, useEffect, useRef } from "react";

import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
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
  ModalInputWrapper,
  ModalContentLarge,
  InputFieldsContainer,
} from "@/components/styledComponents/ModalComponents";

import { sortedCountries, genders, allColumns, newContactTemplate } from "@/utils/contacts/helpers";
import { inputComponentType } from "@/components/contactComponents/InputComponents";

const columnsByCategory = {
  Händler: allColumns.filter(
    (column) =>
      !["club", "nickname", "artist_name", "birth_date", "discord_name"].includes(column.id)
  ),
  Künstler: allColumns.filter(
    (column) => !["club", "nickname", "birth_date", "discord_name"].includes(column.id)
  ),
  Showact: allColumns.filter(
    (column) => !["birth_date", "nickname", "discord_name"].includes(column.id)
  ),
  Workshop: allColumns.filter(
    (column) => !["birth_date", "nickname", "company"].includes(column.id)
  ),
  Verein: allColumns.filter(
    (column) =>
      !["company", "birth_date", "artist_name", "nickname", "discord_name"].includes(column.id)
  ),
  Cosplayer: allColumns.filter((column) => !["nickname", "birth_date"].includes(column.id)),
  Helfer: allColumns.filter(
    (column) => !["company", "club", "website", "artist_name", "instagram"].includes(column.id)
  ),
  Sonstiges: allColumns.filter((column) => !["birth_date"].includes(column.id)),
};

const categories = Object.keys(columnsByCategory);

export default function AddNewContact({ handleCloseAddContactTask, handleAddContact }) {
  const [error, setError] = useState("");
  const [newContact, setNewContact] = useState(newContactTemplate);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Refs für die Input-Felder
  const givenNameRef = useRef(null);
  const surnameRef = useRef(null);

  // Funktion zum Fokussieren des Inputs
  const focusInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  async function onSubmit() {
    if (!selectedCategories.length) {
      setError("Kategorie ist ein Pflichtfeld");
      return;
    }
    if (!newContact.surname) {
      setError("Nachname ist ein Pflichtfeld");
      focusInput(surnameRef);
      return;
    }

    if (!newContact.given_name) {
      setError("Vorname ist ein Pflichtfeld");
      focusInput(givenNameRef);
      return;
    }

    const contactToSave = { ...newContact, category: selectedCategories.join(", ") };
    console.log(contactToSave);

    handleAddContact(contactToSave);
  }

  function handleChange(field, value) {
    setNewContact((prev) => ({ ...prev, [field]: value }));
  }

  function handleCategoryChange(category) {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  }

  function renderInputFields() {
    if (selectedCategories.length === 0) return null;

    const fields = new Set();
    selectedCategories.forEach((category) => {
      columnsByCategory[category].forEach((column) => fields.add(column));
    });

    return Array.from(fields).map((column) => {
      const Component = inputComponentType[column.id];
      if (!Component) return null;

      return (
        <Component
          key={column.id}
          title={column.name}
          inputText={newContact[column.id]}
          inputChange={(value) => handleChange(column.id, value)}
          options={
            column.id === "country" ? sortedCountries : column.id === "gender" ? genders : undefined
          }
          type={
            column.id === "postal_code" ? "number" : column.id === "birth_date" ? "date" : "text"
          }
          inputRef={
            column.id === "given_name" ? givenNameRef : column.id === "surname" ? surnameRef : null
          } // Setze die Refs entsprechend
        />
      );
    });
  }

  return (
    <ModalOverlay onClick={handleCloseAddContactTask}>
      <ModalContentLarge onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={handleCloseAddContactTask} />
        <h2>Neuer Kontakt</h2>
        <div>
          {categories.map((cat, index) => (
            <div key={cat} style={{ display: "inline-block", marginRight: "10px" }}>
              <input
                type="checkbox"
                id={`categoryChoice${index}`}
                name="categoryChoice"
                value={cat}
                onChange={() => handleCategoryChange(cat)}
              />
              <label htmlFor={`categoryChoice${index}`}>{cat}</label>
            </div>
          ))}
        </div>

        <InputFieldsContainer>{renderInputFields()}</InputFieldsContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ModalButtonRightContainer>
          <GreenButton onClick={onSubmit}>Kontakt Speichern</GreenButton>
        </ModalButtonRightContainer>
      </ModalContentLarge>
    </ModalOverlay>
  );
}
