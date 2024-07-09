import React, { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalCloseIcon,
  InputFieldsContainer,
} from "@/components/styledComponents/ModalComponents";
import { GreenButton } from "@/components/styledComponents/StyledButton";

export default function HelperSelectionModal({
  onClose,
  onSelectHelpers,
  selectedHelpers,
  allHelpers,
}) {
  const handleCheckboxChange = (helper) => {
    const isSelected = selectedHelpers.includes(helper.id);
    const updatedSelection = isSelected
      ? selectedHelpers.filter((id) => id !== helper.id)
      : [...selectedHelpers, helper.id];
    onSelectHelpers(updatedSelection);
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseIcon onClick={onClose} />
        <h2>Select Helpers</h2>
        <InputFieldsContainer>
          {allHelpers.map((helper) => (
            <div key={helper.id}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedHelpers.includes(helper.id)}
                  onChange={() => handleCheckboxChange(helper)}
                />
                {helper.given_name} {helper.surname}
              </label>
            </div>
          ))}
        </InputFieldsContainer>
        <br />
        <GreenButton onClick={handleSave}>Save</GreenButton>
      </ModalContent>
    </ModalOverlay>
  );
}
