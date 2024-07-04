import styled from "styled-components";

export const LoginLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

export const LoginInput = styled.input`
  padding: 10px;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

export const LoginInputWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

export const LoginIconButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  & svg {
    width: 100%;
    height: auto;
    fill: ${({ theme }) => theme.color1};
  }
`;
