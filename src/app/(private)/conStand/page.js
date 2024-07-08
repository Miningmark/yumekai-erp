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
  height: calc(100vh - 158px);
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
  height: calc(100vh - 158px - 70px);
  overflow: auto;
  background-color: ${({ theme }) => theme.color1};
  color: ${({ theme }) => theme.textColor};
  padding: 10px;
  border: solid 2px ${({ theme }) => theme.textColor};
`;

const TableBackground = styled.div`
  position: relative;
  height: calc(100vh - 158px - 70px);
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

export default function ConventionStands() {
  const [stands, setStands] = useState([]);
  const [filteredStands, setFilteredStands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeStand, setActiveStand] = useState(null);

  // Search text from stickyMenu
  const search = React.useContext(PageContext);

  useEffect(() => {
    fetchStands();

    socket.on("loadNewStand", fetchStands);

    return () => {
      socket.off("loadNewStand", fetchStands);
    };
  }, []);

  async function fetchStands() {
    const response = await fetch("/api/conStand");
    const data = await response.json();
    setStands(data);
    setFilteredStands(data);
  }

  useEffect(() => {
    if (search) {
      const filtered = stands.filter((stand) =>
        ["location", "con_name", "hotel", "special_notes", "workshops", "helpers"].some(
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

  async function handleAddStand(newStand) {
    try {
      const response = await fetch("/api/conStand", {
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
      const response = await fetch("/api/conStand", {
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

  return (
    <>
      <h2>Infostanände</h2>
      <p>Test</p>
      <GreenButton onClick={() => setShowModal(true)}>Add Infostand</GreenButton>
      <ConventionStandTabBackground>
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
                {filteredStands.map((stand) => (
                  <tr key={stand.id}>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        title={stand[column.id]}
                        onClick={() => {
                          console.log("Infostand: ", stand, stand.id);
                          setActiveStand(stand);
                        }}
                      >
                        {column.id === "start_date" && stand[column.id]
                          ? new Date(stand[column.id]).toLocaleDateString("de-DE") // Anzeige als tt.MM.yyyy
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
          />
        )}
        {showModal && (
          <AddNewConventionStand onAdd={handleAddStand} onClose={handleCloseAddConStand} />
        )}
      </ConventionStandTabBackground>
    </>
  );
}
