import styled from "styled-components";

const CharacterCount = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: ${({ $tooLong, theme }) => ($tooLong == 1 ? "var(--danger)" : theme.textColor)};
`;

export default CharacterCount;
