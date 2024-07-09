"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { PageContext } from "@/components/menu/MenuLayout";
import React from "react";
import {
  StyledButton,
  GreenButton,
  RedButton,
  DisabledGreenButton,
} from "@/components/styledComponents/StyledButton";
import DisplayConventionStandModal from "@/components/conventionStandComponents/ShowConventionStand";
import AddNewConventionStand from "@/components/conventionStandComponents/AddNewConventionStand";
import { socket } from "@/app/socket";
import { newConStandTemplate, allColumns } from "@/utils/conStand/helpers";

const ConventionStandTabBackground = styled.div`
  width: calc(100% - 40px);
  height: calc(100vh - 190px);
  margin: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ConventionStandTabCard = styled.div`
  position: absolute;
  top: 30px;
  width: calc(100% - 24px);
  height: calc(100vh - 190px - 70px);
  overflow: auto;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  padding: 10px;
  border: solid 2px ${({ theme }) => theme.textColor};
`;

const TableBackground = styled.div`
  position: relative;
  height: calc(100vh - 190px - 70px);
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-spacing: 0;
`;

const StyledTableHead = styled.thead`
  th {
    position: sticky;
    top: 0px;
    background-color: ${({ theme }) => theme.color2};
    border: 1px solid ${({ theme }) => theme.textColor};
    font-weight: bold;
    padding: 8px;
    z-index: 1;
    width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const StyledTableBody = styled.tbody`
  td {
    border: 1px solid ${({ theme }) => theme.textColor};
    padding: 8px;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ConventionStandTabList = styled.div`
  display: flex;
  flex-direction: row;
`;

const ConventionStandTabButton = styled.div`
  width: 150px;
  height: 30px;
  background-color: ${({ $activeBackground, theme }) =>
    $activeBackground ? theme.color1 : theme.color2};
  border: solid 2px
    ${({ $activeBoarder, theme }) => ($activeBoarder ? theme.textColor : theme.color1)};
  color: ${({ theme }) => theme.textColor};
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: 0.5s;
  cursor: pointer;
  z-index: ${({ $tabIndex }) => $tabIndex};

  &:hover {
    background-color: ${({ theme }) => theme.color2};
    border: solid 2px ${({ theme }) => theme.textColor};
    border-bottom: none;
    transition: 0.5s;
  }
`;

export default function ConventionStands() {
  const [stands, setStands] = useState(null);
  const [filteredStands, setFilteredStands] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeStand, setActiveStand] = useState(null);
  const [activeTab, setActiveTab] = useState("zukunft");
  const [allHelpers, setAllHelpers] = useState(null);

  // Search text from stickyMenu
  const search = React.useContext(PageContext);

  useEffect(() => {
    fetchStands();
    fetchHelpers();

    socket.on("loadNewStand", fetchStands);

    return () => {
      socket.off("loadNewStand", fetchStands);
    };
  }, []);

  async function fetchStands() {
    const response = await fetch("/api/conStand/stand");
    const data = await response.json();
    setStands(data);
    setFilteredStands(data);
  }
  async function fetchHelpers() {
    try {
      const response = await fetch("/api/conStand/helpers");
      const data = await response.json();
      setAllHelpers(data);
    } catch (error) {
      console.error("Failed to fetch helpers:", error);
    }
  }

  useEffect(() => {
    if (search) {
      const filtered = stands.filter((stand) =>
        [
          "location",
          "con_name",
          "hotel",
          "special_notes",
          "workshops",
          "helpers",
          "start_date",
          "end_date",
        ].some(
          (field) =>
            stand[field] && stand[field].toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredStands(filtered);
    } else {
      setFilteredStands(stands);
    }
  }, [search, stands]);

  const columns = allColumns.filter((column) => !["id", "created_at"].includes(column.id));

  function getFilteredStandsByTab() {
    const now = new Date();
    if (search) {
      return filteredStands;
    }
    if (activeTab === "zukunft") {
      return filteredStands.filter((stand) => new Date(stand.end_date) >= now);
    } else {
      return filteredStands.filter((stand) => new Date(stand.end_date) < now);
    }
  }

  async function handleAddStand(newStand) {
    try {
      const response = await fetch("/api/conStand/stand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStand),
      });

      if (response.ok) {
        const { id } = await response.json();
        setStands((prevStands) => [
          ...prevStands,
          {
            id,
            ...newStand,
          },
        ]);
      }
      socket.emit("newStand", "Hello Server");
    } catch (error) {
      console.error("Error adding stand:", error);
    }
  }

  function handleCloseAddConStand() {
    setShowModal(false);
  }

  async function handleEditConStand(editConStand) {
    const convertedStand = { ...editConStand, helpers: JSON.stringify(editConStand.helpers) };
    try {
      const response = await fetch("/api/conStand/stand", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(convertedStand),
      });

      const data = await response.json();

      if (response.ok) {
        socket.emit("newStand", "Hello Server");
        setStands(stands.map((stand) => (stand.id === editConStand.id ? editConStand : stand)));
      } else {
        console.error("Fehler beim Speichern des Infostandes. ", data);
      }
    } catch (error) {
      console.error("Fehler beim Bearbeiten des Infostandes:", error);
    }
  }

  function changeTab(category) {
    setActiveTab(category);
  }

  if (!stands || !allHelpers) {
    return <p>Loading</p>;
  }

  return (
    <>
      <h1>Infostanände</h1>
      <GreenButton onClick={() => setShowModal(true)}>Add Infostand</GreenButton>
      <ConventionStandTabBackground>
        <ConventionStandTabList>
          {!search ? (
            <>
              <ConventionStandTabButton
                onClick={() => changeTab("zukunft")}
                $activeBackground={"zukunft" === activeTab ? 1 : 0}
                $activeBoarder={"zukunft" === activeTab ? 1 : 0}
                $tabIndex={"zukunft" === activeTab ? "1" : "0"}
              >
                zukunft
              </ConventionStandTabButton>
              <ConventionStandTabButton
                onClick={() => changeTab("vergangenheit")}
                $activeBackground={"vergangenheit" === activeTab ? 1 : 0}
                $activeBoarder={"vergangenheit" === activeTab ? 1 : 0}
                $tabIndex={"vergangenheit" === activeTab ? "1" : "0"}
              >
                vergangenheit
              </ConventionStandTabButton>
            </>
          ) : (
            <>
              <ConventionStandTabButton
                $activeBackground={"var(--light)"}
                $activeBoarder={"var(--dark)"}
                $tabIndex={"1"}
              >
                Suche
              </ConventionStandTabButton>
            </>
          )}
        </ConventionStandTabList>

        <ConventionStandTabCard>
          <TableBackground>
            <StyledTable>
              <StyledTableHead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.id} title={column.name}>
                      {column.name}
                    </th>
                  ))}
                </tr>
              </StyledTableHead>
              <StyledTableBody>
                {getFilteredStandsByTab().map((stand) => (
                  <tr key={stand.id}>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        title={stand[column.id]}
                        onClick={() => {
                          setActiveStand(stand);
                        }}
                      >
                        {(column.id === "start_date" || column.id === "end_date") &&
                        stand[column.id]
                          ? new Date(stand[column.id]).toLocaleDateString("de-DE") // Anzeige als tt.MM.yyyy
                          : column.id === "helpers"
                          ? stand.helpers
                              .map((helperID) => {
                                const helperData = allHelpers.find(
                                  (helper) => helper.id == helperID
                                );
                                return `${helperData.given_name} ${helperData.surname}`;
                              })
                              .join(", ")
                          : Array.isArray(stand[column.id])
                          ? stand[column.id].join(", ")
                          : stand[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </StyledTableBody>
            </StyledTable>
          </TableBackground>
        </ConventionStandTabCard>
        {activeStand && (
          <DisplayConventionStandModal
            stand={activeStand}
            onClose={() => setActiveStand(null)}
            onEditStand={handleEditConStand}
            allHelpers={allHelpers}
          />
        )}
        {showModal && (
          <AddNewConventionStand
            onAdd={handleAddStand}
            onClose={handleCloseAddConStand}
            allHelpers={allHelpers}
          />
        )}
      </ConventionStandTabBackground>
    </>
  );
}
