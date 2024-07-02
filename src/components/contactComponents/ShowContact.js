import { useState } from "react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editableContact, setEditableContact] = useState(contact);
  console.log(editableContact);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    handleEditContact(editableContact);
    console.log("Saved contact:", editableContact);
  };

  const handleChange = (field, value) => {
    setEditableContact((prev) => ({ ...prev, [field]: value }));
  };

  const renderInputFields = () => {
    if (!editableContact.category) return null;

    return columnsByCategory[editableContact.category].map((column) => {
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
              <>
                <input
                  key={cat}
                  type="radio"
                  id={`categoryChoice${index}`}
                  name="categoryChoice"
                  value={cat}
                  checked={editableContact.category === cat}
                  onChange={() => handleChange("category", cat)}
                />
                <label htmlFor={`categoryChoice${index}`} style={{ paddingRight: "10px" }}>
                  {cat}
                </label>
              </>
            ))}
          </div>
        )}
        <InputFieldsContainer>{renderInputFields()}</InputFieldsContainer>
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
