import { use, useEffect } from "react";
import styled from "styled-components";

const ColorLegendContainer = styled.div`
  position: absolute;
  top: 85px;
  left: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 30px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  border-radius: var(--border-radius);
  cursor: pointer;

  &:hover + div {
    display: flex;
  }
`;

const ColorLegendList = styled.div`
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  width: 120px;
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: var(--border-radius);
  position: absolute;
  top: 120px;
  left: 200px;
  z-index: 1;
`;

const ColorLegendItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 30px;
  background-color: ${(props) => props.color};
  color: var(--text-color);
  border-radius: var(--border-radius);
`;

export default function ColorLegend({ colorsOptions }) {
  return (
    <>
      <ColorLegendContainer>Farb Legende</ColorLegendContainer>
      <ColorLegendList>
        {colorsOptions.map((item, index) => (
          <ColorLegendItem key={index} color={item.color}>
            {item.name}
          </ColorLegendItem>
        ))}
      </ColorLegendList>
    </>
  );
}
