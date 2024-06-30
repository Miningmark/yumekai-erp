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
          name="name"
          id="name"
          type={type}
          onChange={(e) => inputChange(type === "number" ? +e.target.value : e.target.value)}
        />
        <InputLabel className="inputLabel" htmlFor="name">
          {title}
        </InputLabel>
      </InputWrapper>
      <br />
    </>
  );
}

function InputOptionTextArea({ title, inputText, inputChange }) {
  return (
    <>
      <InputWrapper className="input">
        <InputArea
          className="inputField"
          placeholder=" "
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
      <br />
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
      <DropdownContainer>
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
      </DropdownContainer>
      <br />
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

const categories = [
  "Händler",
  "Künstler",
  "Showact",
  "Sonstiges",
  "Workshop",
  "Verein",
  "Cosplayer",
  "Helfer",
];

export default function AddNewContact({ handleCloseAddContactTask, handleAddContact }) {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [club, setClub] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [plz, setPlz] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [country, setCountry] = useState("");
  const [contactBy, setContactBy] = useState("");
  const [notes, setNotes] = useState("");
  const [previousCollaboration, setPreviousCollaboration] = useState("");
  const [category, setCategory] = useState(null);

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
      plz,
      city,
      street,
      houseNumber,
      country,
      contactBy,
      notes,
      previousCollaboration,
      category,
    };

    console.log(newContact);
    handleAddContact(newContact);
  }

  return (
    <ModalOverlay onClick={handleCloseAddContactTask}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={handleCloseAddContactTask} />
        <h2>Neuer Kontakt</h2>

        <InputOptionSelect
          title={"Kategorie"}
          options={categories}
          selectedOption={category}
          onChange={setCategory}
        />
        <InputOptionInput title={"Name"} inputText={name} inputChange={setName} />
        <InputOptionInput title={"Firma Name"} inputText={company} inputChange={setCompany} />
        <InputOptionInput title={"Verein Name"} inputText={club} inputChange={setClub} />
        <InputOptionInput title={"E-Mail"} inputText={email} inputChange={setEmail} />
        <InputOptionInput title={"Telefon"} inputText={phone} inputChange={setPhone} />
        <InputOptionInput title={"Webseite"} inputText={website} inputChange={setWebsite} />
        <InputOptionInput title={"Instagram"} inputText={instagram} inputChange={setInstagram} />
        <InputOptionInput title={"PLZ"} inputChange={setPlz} type="number" />
        <InputOptionInput title={"Stadt"} inputText={city} inputChange={setCity} />
        <InputOptionInput title={"Straße"} inputText={street} inputChange={setStreet} />
        <InputOptionInput
          title={"Hausnummer"}
          inputText={houseNumber}
          inputChange={setHouseNumber}
        />
        <InputOptionSelect
          title={"Land"}
          options={sortedCountries}
          selectedOption={country}
          onChange={setCountry}
        />
        <InputOptionInput
          title={"Kontakt durch"}
          inputText={contactBy}
          inputChange={setContactBy}
        />
        <InputOptionTextArea title={"Sonstiges"} inputText={notes} inputChange={setNotes} />
        <InputOptionTextArea
          title={"Bisherige Zusammenarbeit"}
          inputText={previousCollaboration}
          inputChange={setPreviousCollaboration}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ModalButtonRightContainer>
          <GreenButton onClick={onSubmit}>Kontakt Speichern</GreenButton>
        </ModalButtonRightContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
