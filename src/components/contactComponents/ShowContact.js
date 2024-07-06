import { useState, useRef } from "react";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";
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

import { sortedCountries, genders, allColumns } from "@/utils/contacts/helpers";
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

export default function DisplayContactModal({ contact, handleOnClose, handleEditContact }) {
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editableContact, setEditableContact] = useState(contact);

  // Refs für die Input-Felder
  const givenNameRef = useRef(null);
  const surnameRef = useRef(null);
  const postal_codeRef = useRef(null);

  // Funktion zum Fokussieren des Inputs
  const focusInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (!editableContact.category.length) {
      setError("Kategorie ist ein Pflichtfeld");
      return;
    }
    if (!editableContact.surname) {
      setError("Nachname ist ein Pflichtfeld");
      focusInput(surnameRef);
      return;
    }
    if (!editableContact.given_name) {
      setError("Vorname ist ein Pflichtfeld");
      focusInput(givenNameRef);
      return;
    }
    if (editableContact.postal_code < 0) {
      setError("Die Postleitzahl kann nicht Negativ sein");
      focusInput(postal_codeRef);
      return;
    }

    //TODO: wenn fehler beim speichern nicht in die lokale Liste eintagen und user fehler anzeigen.
    setError("");
    setIsEditing(false);
    handleEditContact(editableContact);
  };

  const handleChange = (field, value) => {
    setEditableContact((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (category) => {
    setEditableContact((prev) => {
      const categories = prev.category.includes(category)
        ? prev.category.filter((cat) => cat !== category)
        : [...prev.category, category];
      return { ...prev, category: categories };
    });
  };

  const renderInputFields = () => {
    if (!editableContact.category) return null;

    const allFields = editableContact.category
      .map((category) => columnsByCategory[category])
      .flat();

    const uniqueFields = [...new Map(allFields.map((field) => [field.id, field])).values()];

    return uniqueFields.map((column) => {
      const Component = inputComponentType[column.id];
      if (!Component) return null;

      return (
        <Component
          key={column.id}
          title={column.name}
          inputText={editableContact[column.id]}
          inputChange={(value) => handleChange(column.id, value)}
          options={
            column.id === "country" ? sortedCountries : column.id === "gender" ? genders : undefined
          }
          type={
            column.id === "postal_code" ? "number" : column.id === "birth_date" ? "date" : "text"
          }
          editable={isEditing}
          inputRef={
            column.id === "given_name"
              ? givenNameRef
              : column.id === "surname"
              ? surnameRef
              : column.id === "postal_code"
              ? postal_codeRef
              : null
          }
        />
      );
    });
  };

  return (
    <ModalOverlay onClick={handleOnClose}>
      <ModalContentLarge onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={handleOnClose} />
        <h2>Kontakt anzeigen</h2>
        {isEditing && (
          <div>
            {categories.map((cat, index) => (
              <div key={cat} style={{ display: "inline-block", marginRight: "10px" }}>
                <input
                  type="checkbox"
                  id={`categoryChoice${index}`}
                  name="categoryChoice"
                  value={cat}
                  checked={editableContact.category.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                <label htmlFor={`categoryChoice${index}`} style={{ paddingRight: "10px" }}>
                  {cat}
                </label>
              </div>
            ))}
          </div>
        )}
        <InputFieldsContainer>{renderInputFields()}</InputFieldsContainer>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ModalButtonRightContainer>
          {isEditing ? (
            <GreenButton onClick={handleSaveClick}>Speichern</GreenButton>
          ) : (
            <StyledButton onClick={handleEditClick}>Bearbeiten</StyledButton>
          )}
          <RedButton onClick={handleOnClose}>Schließen</RedButton>
        </ModalButtonRightContainer>
      </ModalContentLarge>
    </ModalOverlay>
  );
}
