"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

const SurveyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.textColor};
`;

export default function DashBoard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/survey");
        if (!response.ok) {
          throw new Error("Failed to fetch survey data");
        }
        const data = await response.json();
        setData(data);
        return data;
      } catch (error) {
        console.error("Failed to fetch survey data:", error);
      }
    }
    fetchData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>YumeKai 2024 Umfrage</h1>
      <SurveyContainer>
        <p>
          Number of participants: <span>{data.count}</span>
        </p>
        <h2>Average Ratings by Day</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
          {data.averagesByDay.map((dayData) => (
            <div key={dayData.day}>
              <h3>Day: {dayData.day}</h3>
              <p>YumeKai Rating: {dayData.yumeKaiRatingAvg.toFixed(2)}</p>
              <p>Stage Program Rating: {dayData.stageProgramRatingAvg.toFixed(2)}</p>
              <p>Price Rating: {dayData.priceRatingAvg.toFixed(2)}</p>
              <p>Workshop Rating: {dayData.workshopRatingAvg.toFixed(2)}</p>
              <p>Vendor Rating: {dayData.vendorRatingAvg.toFixed(2)}</p>
              <p>Artist Rating: {dayData.artistRatingAvg.toFixed(2)}</p>
              <p>Game Area Rating: {dayData.gameAreaRatingAvg.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <h3>
          Overall Average Rating: <span>{data.overallAvgRating.toFixed(2)}</span>
        </h3>
        <h3>
          Best average user Rating: <span>{data.bestRow.averageRating.toFixed(2)}</span>
        </h3>
        <h3>
          Worst average user Rating: <span>{data.worstRow.averageRating.toFixed(2)}</span>
        </h3>
        <h2>Best Parts and Improvements</h2>
        <table style={{ borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>Best Parts</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Improvements</th>
            </tr>
          </thead>
          <tbody>
            {data.bestParts.map((part, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{part}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {data.improvements[index] || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SurveyContainer>
    </>
  );
}
