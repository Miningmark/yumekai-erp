"use client";

import { useState, useEffect } from "react";

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

function InputOptionInput({ title, inputText, inputChange, type = "text" }) {
  return (
    <>
      <InputWrapper className="input">
        <InputField
          className="inputField"
          placeholder=" "
          name={title}
          id={title}
          type={type}
          onChange={(e) => inputChange(type === "number" ? +e.target.value : e.target.value)}
        />
        <InputLabel className="inputLabel" htmlFor="name">
          {title}
        </InputLabel>
      </InputWrapper>
    </>
  );
}

function InputOptionTextArea({ title, inputText, inputChange }) {
  return (
    <>
      <InputWrapper className="input">
        <InputArea
          className="inputField"
          placeholder=""
          type="text"
          name="name"
          id="name"
          onChange={(e) => inputChange(e.target.value)}
          rows="3"
        />
        <InputLabel className="inputLabel" htmlFor="name">
          {title}
        </InputLabel>
      </InputWrapper>
    </>
  );
}

function InputOptionSelect({ title, options, selectedOption, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
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
  /*
  return (
    <DropdownContainer>
      <DropdownField
        defaultValue=""
        as="select"
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled hidden></option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </DropdownField>
      <DropdownLabel>{title}</DropdownLabel>
    </DropdownContainer>
  );
  return (
    <ModalInputWrapper>
      <p>{title}:</p>
      <ModalInputField
        as="select"
        value={selectedOption}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select {title}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </ModalInputField>
    </ModalInputWrapper>
  );
  */
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

export default function AddNewContact({ handleCloseAddContactTask, handleAddContact }) {
  const [error, setError] = useState("");
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [postalCode, setPostalCode] = useState(null);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [country, setCountry] = useState("");
  const [contactBy, setContactBy] = useState("");
  const [notes, setNotes] = useState("");
  const [previousCollaboration, setPreviousCollaboration] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [discordName, setDiscordName] = useState("");
  const [gender, setGender] = useState("");

  async function onSubmit() {
    if (!name) {
      setError("Name ist ein Pflichtfeld");
      return;
    }
    if (!category) {
      setError("Kategorie ist ein Pflichtfeld");
      return;
    }
    const newContact = {
      name,
      company,
      club,
      email,
      phone,
      website,
      instagram,
      postal_code: postalCode,
      city,
      street,
      house_number: houseNumber,
      country,
      contact_by: contactBy,
      notes,
      previous_collaboration: previousCollaboration,
      birth_date: birthDate,
      discord_name: discordName,
      gender,
      category,
    };

    console.log(newContact);
    handleAddContact(newContact);
  }

  const renderInputFields = () => {
    if (!category) return null;

    return columnsByCategory[category].map((column) => {
      switch (column.id) {
        case "name":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={name}
              inputChange={setName}
            />
          );
        case "company":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={company}
              inputChange={setCompany}
            />
          );
        case "club":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={club}
              inputChange={setClub}
            />
          );
        case "email":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={email}
              inputChange={setEmail}
            />
          );
        case "phone":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={phone}
              inputChange={setPhone}
            />
          );
        case "website":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={website}
              inputChange={setWebsite}
            />
          );
        case "instagram":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={instagram}
              inputChange={setInstagram}
            />
          );
        case "postal_code":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={postalCode}
              inputChange={setPostalCode}
              type="number"
            />
          );
        case "city":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={city}
              inputChange={setCity}
            />
          );
        case "street":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={street}
              inputChange={setStreet}
            />
          );
        case "house_number":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={houseNumber}
              inputChange={setHouseNumber}
            />
          );
        case "country":
          return (
            <InputOptionSelect
              key={column.id}
              title={column.name}
              options={sortedCountries}
              selectedOption={country}
              onChange={setCountry}
            />
          );
        case "contact_by":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={contactBy}
              inputChange={setContactBy}
            />
          );
        case "notes":
          return (
            <InputOptionTextArea
              key={column.id}
              title={column.name}
              inputText={notes}
              inputChange={setNotes}
            />
          );
        case "previous_collaboration":
          return (
            <InputOptionTextArea
              key={column.id}
              title={column.name}
              inputText={previousCollaboration}
              inputChange={setPreviousCollaboration}
            />
          );
        case "birth_date":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={birthDate}
              inputChange={setBirthDate}
              type="date"
            />
          );
        case "discord_name":
          return (
            <InputOptionInput
              key={column.id}
              title={column.name}
              inputText={discordName}
              inputChange={setDiscordName}
            />
          );
        case "gender":
          return (
            <InputOptionSelect
              key={column.id}
              title={column.name}
              options={genders}
              selectedOption={gender}
              onChange={setGender}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <ModalOverlay onClick={handleCloseAddContactTask}>
      <ModalContentLarge onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={handleCloseAddContactTask} />
        <h2>Neuer Kontakt</h2>
        <div>
          {categories.map((cat, index) => (
            <>
              <input
                key={cat}
                type="radio"
                id={`categoryChoice${index}`}
                name="categoryChoice"
                value={cat}
                onChange={() => setCategory(cat)}
              />
              <label htmlFor={`categoryChoice${index}`} style={{ paddingRight: "10px" }}>
                {cat}
              </label>
            </>
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
