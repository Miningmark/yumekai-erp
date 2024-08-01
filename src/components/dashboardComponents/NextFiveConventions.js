import { useState, useEffect } from "react";
import styled from "styled-components";
import { convertDateFormat } from "@/utils/timeFunctions";

const NextFiveContainer = styled.div`
  width: 300px;
  height: 450px;
  padding: 20px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px;

  h2 {
    margin: 0;
    padding: 10px;
    text-align: center;
  }
`;

const ConCard = styled.div`
  border-radius: var(--border-radius);
  padding: 5px;
  background-color: ${({ theme }) => theme.color2};

  h3 {
    margin: 0;
    padding: 0;
    color: var(--secondary-color);
  }

  p {
    margin: 0;
    padding: 0;
  }
`;

export default function NextFiveConventions() {
  const [nextCons, setNextCons] = useState([]);

  useEffect(() => {
    fetchNextFiveConventions();
  }, []);

  async function fetchNextFiveConventions() {
    try {
      //const response = await fetch("/api/conStand/stand/nextFive");
      const response = await fetch("/api/conStand/nextStands");
      if (!response.ok) {
        throw new Error("Failed to fetch next five conventions");
      }
      const data = await response.json();
      setNextCons(data);
    } catch (error) {
      console.error("Error fetching next five conventions:", error);
    }
  }

  return (
    <NextFiveContainer>
      <h2>Nächste Cons</h2>
      {nextCons.map((con) => (
        <ConCard key={con.id}>
          <h3>{con.con_name}</h3>
          <p>Ort: {con.location}</p>
          <p>Datum: {convertDateFormat(con.start_date)}</p>
        </ConCard>
      ))}
    </NextFiveContainer>
  );
}
