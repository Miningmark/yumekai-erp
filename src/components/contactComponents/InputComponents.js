import { useState } from "react";
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

export const inputComponentType = {
  name: InputOptionInput,
  nickname: InputOptionInput,
  artist_name: InputOptionInput,
  company: InputOptionInput,
  club: InputOptionInput,
  email: InputOptionInput,
  phone: InputOptionInput,
  website: InputOptionInput,
  instagram: InputOptionInput,
  postal_code: InputOptionInput,
  city: InputOptionInput,
  street: InputOptionInput,
  house_number: InputOptionInput,
  country: InputOptionSelect,
  contact_by: InputOptionInput,
  notes: InputOptionTextArea,
  previous_collaboration: InputOptionTextArea,
  birth_date: InputOptionInput,
  discord_name: InputOptionInput,
  gender: InputOptionSelect,
};

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
          value={inputText || ""}
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
          value={inputText || ""}
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

function InputOptionSelect({ title, options, inputText, inputChange, editable }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    if (editable) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option) => {
    inputChange(option);
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
          {inputText ? inputText : "-- Auswahl --"}
        </DropdownButton>
        {isOpen && (
          <DropdownMenu>
            {options.map((option, index) => (
              <DropdownItem key={index} onClick={() => handleOptionClick(option)}>
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
