import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: var(--dark-grey);
  color: var(--grey);
  border-radius: var(--border-radius);
  border: none;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: scale(1);
  transition: 0.5s;

  min-width: 50px;

  font-weight: bold;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.08);
    transition: 0.5s;
  }
`;

export const GreenButton = styled(StyledButton)`
  background-color: var(--success);
  color: white;
`;

export const RedButton = styled(StyledButton)`
  background-color: var(--danger);
  color: white;
`;

export const DisabledGreenButton = styled(GreenButton)`
  opacity: 0.5;
  cursor: not-allowed;
`;
