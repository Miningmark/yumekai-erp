import styled from "styled-components";

const CharacterCount = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: ${(props) => props.$tooLong};
`;

export default CharacterCount;
