import { useState } from "react";
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

import {
  InputField,
  InputArea,
  InputLabel,
  InputWrapper,
  DropdownLabel,
  DropdownContainer,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from "../styledComponents/StyledInputField";

function InputOptionInput({ title, inputText, inputChange, type = "text", editable }) {
  return (
    <>
      <InputWrapper className="input">
        <InputField
          className="inputField"
          placeholder=" "
          name={title}
          id={title}
          type={type}
          value={inputText}
          onChange={(e) => inputChange(type === "number" ? +e.target.value : e.target.value)}
          disabled={!editable}
        />
        <InputLabel className="inputLabel" htmlFor={title}>
          {title}
        </InputLabel>
      </InputWrapper>
    </>
  );
}

function InputOptionTextArea({ title, inputText, inputChange, editable }) {
  return (
    <>
      <InputWrapper className="input">
        <InputArea
          className="inputField"
          placeholder=""
          type="text"
          name={title}
          id={title}
          value={inputText}
          onChange={(e) => inputChange(e.target.value)}
          rows="3"
          disabled={!editable}
        />
        <InputLabel className="inputLabel" htmlFor={title}>
          {title}
        </InputLabel>
      </InputWrapper>
    </>
  );
}

function InputOptionSelect({ title, options, selectedOption, onChange, editable }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    if (editable) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <>
      <InputWrapper>
        <DropdownButton
          onClick={handleDropdownClick}
          $dropdownopen={isOpen ? `var(--secondary-color)` : `var(--dark)`}
          disabled={!editable}
        >
          {selectedOption ? selectedOption : "-- Auswahl --"}
        </DropdownButton>
        {isOpen && (
          <DropdownMenu>
            {options.map((option) => (
              <DropdownItem key={option} onClick={() => handleOptionClick(option)}>
                {option}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
        <DropdownLabel>{title}</DropdownLabel>
      </InputWrapper>
    </>
  );
}

const countries = [
  "Belgium",
  "Bulgaria",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Austria",
  "Croatia",
  "Cyprus",
];
const sortedCountries = ["Germany", ...countries.filter((country) => country !== "Germany").sort()];

const genders = ["Männlich", "Weiblich", "Divers"];

const allColumns = [
  { id: "name", name: "Name" },
  { id: "company", name: "Firma" },
  { id: "club", name: "Verein" },
  { id: "email", name: "E-Mail" },
  { id: "phone", name: "Telefon" },
  { id: "website", name: "Website" },
  { id: "instagram", name: "Instagram" },
  { id: "postal_code", name: "PLZ" },
  { id: "city", name: "Stadt" },
  { id: "street", name: "Straße" },
  { id: "house_number", name: "Hausnr." },
  { id: "country", name: "Land" },
  { id: "contact_by", name: "Kontakt durch" },
  { id: "birth_date", name: "Geburtsdatum" },
  { id: "discord_name", name: "Discord Name" },
  { id: "gender", name: "Geschlecht" },
  { id: "notes", name: "Notizen" },
  { id: "previous_collaboration", name: "Frühere Zusammenarbeit" },
];

const columnsByCategory = {
  Händler: allColumns.filter(
    (column) => !["club", "birth_date", "discord_name"].includes(column.id)
  ),
  Künstler: allColumns.filter(
    (column) => !["club", "birth_date", "discord_name"].includes(column.id)
  ),
  Showact: allColumns.filter((column) => !["birth_date", "discord_name"].includes(column.id)),
  Workshop: allColumns.filter((column) => !["birth_date", "company"].includes(column.id)),
  Verein: allColumns.filter(
    (column) => !["company", "birth_date", "discord_name"].includes(column.id)
  ),
  Cosplayer: allColumns.filter((column) => !["birth_date"].includes(column.id)),
  Helfer: allColumns.filter(
    (column) => !["company", "club", "website", "instagram"].includes(column.id)
  ),
  Sonstiges: allColumns.filter((column) => !["birth_date"].includes(column.id)),
};

const categories = Object.keys(columnsByCategory);

export default function DisplayContactModal({ contact, handleOnClose, handleEditContact }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContact, setEditableContact] = useState(contact);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Save changes (you can implement save logic here)
    handleEditContact(editableContact);
    console.log("Saved contact:", editableContact);
  };

  const handleChange = (field, value) => {
    setEditableContact((prev) => ({ ...prev, [field]: value }));
  };

  const renderInputFields = () => {
    if (!editableContact.category) return null;

    return columnsByCategory[editableContact.category].map((column) => {
      switch (column.id) {
        case "name":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.name}
              inputChange={(value) => handleChange("name", value)}
              editable={isEditing}
            />
          );
        case "company":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.company}
              inputChange={(value) => handleChange("company", value)}
              editable={isEditing}
            />
          );
        case "club":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.club}
              inputChange={(value) => handleChange("club", value)}
              editable={isEditing}
            />
          );
        case "email":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.email}
              inputChange={(value) => handleChange("email", value)}
              editable={isEditing}
            />
          );
        case "phone":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.phone}
              inputChange={(value) => handleChange("phone", value)}
              editable={isEditing}
            />
          );
        case "website":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.website}
              inputChange={(value) => handleChange("website", value)}
              editable={isEditing}
            />
          );
        case "instagram":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.instagram}
              inputChange={(value) => handleChange("instagram", value)}
              editable={isEditing}
            />
          );
        case "postal_code":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.postal_code}
              inputChange={(value) => handleChange("postal_code", value)}
              type="number"
              editable={isEditing}
            />
          );
        case "city":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.city}
              inputChange={(value) => handleChange("city", value)}
              editable={isEditing}
            />
          );
        case "street":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.street}
              inputChange={(value) => handleChange("street", value)}
              editable={isEditing}
            />
          );
        case "house_number":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.house_number}
              inputChange={(value) => handleChange("house_number", value)}
              editable={isEditing}
            />
          );
        case "country":
          return (
            <InputOptionSelect
              key={column.id}
              title={column.name}
              options={sortedCountries}
              selectedOption={editableContact.country}
              onChange={(value) => handleChange("country", value)}
              editable={isEditing}
            />
          );
        case "contact_by":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.contact_by}
              inputChange={(value) => handleChange("contact_by", value)}
              editable={isEditing}
            />
          );
        case "notes":
          return (
            <InputOptionTextArea
              key={column.id}
              title={column.name}
              inputText={editableContact.notes}
              inputChange={(value) => handleChange("notes", value)}
              editable={isEditing}
            />
          );
        case "previous_collaboration":
          return (
            <InputOptionTextArea
              key={column.id}
              title={column.name}
              inputText={editableContact.previous_collaboration}
              inputChange={(value) => handleChange("previous_collaboration", value)}
              editable={isEditing}
            />
          );
        case "birth_date":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.birth_date}
              inputChange={(value) => handleChange("birth_date", value)}
              type="date"
              editable={isEditing}
            />
          );
        case "discord_name":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={editableContact.discord_name}
              inputChange={(value) => handleChange("discord_name", value)}
              editable={isEditing}
            />
          );
        case "gender":
          return (
            <InputOptionSelect
              key={column.id}
              title={column.name}
              options={genders}
              selectedOption={editableContact.gender}
              onChange={(value) => handleChange("gender", value)}
              editable={isEditing}
            />
          );
        default:
          return null;
      }
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
