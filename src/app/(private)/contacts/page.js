"use client";

import { useState, useEffect } from "react";
import AddNewContact from "@/components/contactComponents/AddNewContact";
import styled from "styled-components";
import { PageContext } from "@/components/menu/MenuLayout";
import React from "react";
import {
  StyledButton,
  GreenButton,
  RedButton,
  DisabledGreenButton,
} from "@/components/styledComponents/StyledButton";
import DisplayContactModal from "@/components/contactComponents/ShowContact";
import { sortedCountries, genders, allColumns } from "@/utils/contacts/helpers";
import { socket } from "@/app/socket";
import { convertDateFormat } from "@/utils/timeFunctions";

const ContactTabBackground = styled.div`
  width: calc(100% - 40px);
  height: calc(100vh - 190px);
  margin: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ContactTabList = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContactTabButton = styled.div`
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

const ContactTabCard = styled.div`
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
    width: 150px; /* Feste Breite der Spalten */
    white-space: nowrap; /* Verhindert Zeilenumbrüche */
    overflow: hidden;
    text-overflow: ellipsis; /* Fügt "..." hinzu, wenn Text abgeschnitten wird */
  }
`;

const StyledTableBody = styled.tbody`
  td {
    border: 1px solid ${({ theme }) => theme.textColor};
    padding: 8px;
    max-width: 150px; /* Maximale Breite der Zellen */
    white-space: nowrap; /* Verhindert Zeilenumbrüche */
    overflow: hidden;
    text-overflow: ellipsis; /* Fügt "..." hinzu, wenn Text abgeschnitten wird */
  }
`;

const columnsByCategory = {
  Händler: allColumns.filter(
    (column) =>
      ![
        "id",
        "nickname",
        "artist_name",
        "category",
        "club",
        "created_at",
        "birth_date",
        "discord_name",
        "stand_helper",
      ].includes(column.id)
  ),
  Künstler: allColumns.filter(
    (column) =>
      ![
        "id",
        "nickname",
        "category",
        "club",
        "created_at",
        "birth_date",
        "discord_name",
        "stand_helper",
      ].includes(column.id)
  ),
  Showact: allColumns.filter(
    (column) =>
      ![
        "id",
        "nickname",
        "category",
        "created_at",
        "birth_date",
        "discord_name",
        "stand_helper",
      ].includes(column.id)
  ),
  Workshop: allColumns.filter(
    (column) =>
      ![
        "id",
        "nickname",
        "category",
        "created_at",
        "birth_date",
        "company",
        "stand_helper",
      ].includes(column.id)
  ),
  Verein: allColumns.filter(
    (column) =>
      ![
        "id",
        "category",
        "nickname",
        "artist_name",
        "company",
        "created_at",
        "birth_date",
        "discord_name",
        "stand_helper",
      ].includes(column.id)
  ),
  Cosplayer: allColumns.filter(
    (column) =>
      !["id", "nickname", "category", "created_at", "birth_date", "stand_helper"].includes(
        column.id
      )
  ),
  Helfer: allColumns.filter(
    (column) =>
      ![
        "id",
        "category",
        "artist_name",
        "created_at",
        "company",
        "club",
        "website",
        "instagram",
      ].includes(column.id)
  ),
  Sonstiges: allColumns.filter((column) => !["id", "category", "created_at"].includes(column.id)),
};

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Händler");
  const [activeContact, setActiveContact] = useState(null);

  console.log(activeContact);

  //Suchtext vom stickyMenu
  const search = React.useContext(PageContext);

  useEffect(() => {
    fetchContacts();

    socket.on("loadNewContact", fetchContacts);

    return () => {
      socket.off("loadNewContact", fetchContacts);
    };
  }, []);

  async function fetchContacts() {
    const response = await fetch("/api/contacts");
    const data = await response.json();
    setContacts(data);
    setFilteredContacts(data);
  }

  useEffect(() => {
    if (search) {
      const filtered = contacts.filter((contact) =>
        allColumns.some(
          (column) =>
            contact[column.id] &&
            contact[column.id].toString().toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [search, contacts]);

  async function handleAddContact(newContact) {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContact),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData && responseData.insertId) {
          setContacts([...contacts, { ...newContact, id: responseData.insertId }]);
          setFilteredContacts([...contacts, { ...newContact, id: responseData.insertId }]);
          setShowModal(false);
          socket.emit("newContact", "Hello Server");
        } else {
          console.error("Fehler beim hinzufügen des Kontakts: Antwort enthält keine insertId. ");
        }
      } else {
        console.error("Fehler beim hinzufügen des Kontakts. ", response.status);
      }
    } catch (error) {
      console.error("Fehler beim hinzufügen des Kontakts:", error);
    }
  }

  function changeTab(category) {
    setActiveTab(category);
  }

  const currentCategoryContacts = !search
    ? filteredContacts.filter((contact) => contact.category.includes(activeTab))
    : contacts.filter((contact) =>
        allColumns.some(
          (column) =>
            contact[column.id] &&
            contact[column.id].toString().toLowerCase().includes(search.toLowerCase())
        )
      );

  const columns = !search
    ? columnsByCategory[activeTab]
    : allColumns.filter((column) => !["id", "created_at"].includes(column.id));

  function handleOnClose() {
    setActiveContact(null);
  }

  async function handleEditContact(editContact) {
    const contactToSave = { ...editContact, category: editContact.category.join(", ") };
    try {
      const response = await fetch("/api/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactToSave),
      });

      const data = await response.json();

      if (response.ok) {
        socket.emit("newContact", "Hello Server");
        setContacts(
          contacts.map((contact) => (contact.id === editContact.id ? editContact : contact))
        );
      } else {
        console.error("Fehler beim Speichern des Kontakts. ", data);
      }
    } catch (error) {
      console.error("Fehler beim Bearbeiten des Kontakts:", error);
    }
  }

  function openUrl(url) {
    if (!url) {
      return;
    }
    const formattedUrl = url.startsWith("http") ? url : `http://${url}`;
    window.open(formattedUrl);
  }

  function openInsta(name) {
    if (!name) {
      return;
    }
    window.open(`https://www.instagram.com/${name}/`);
  }

  return (
    <>
      <h1>Kontakte</h1>
      <GreenButton onClick={() => setShowModal(true)}>Add Contact</GreenButton>
      <ContactTabBackground>
        <ContactTabList>
          {!search ? (
            <>
              {Object.keys(columnsByCategory).map((category) => (
                <ContactTabButton
                  key={category}
                  onClick={() => changeTab(category)}
                  $activeBackground={category === activeTab ? 1 : 0}
                  $activeBoarder={category === activeTab ? 1 : 0}
                  $tabIndex={category === activeTab ? "1" : "0"}
                >
                  {category}
                </ContactTabButton>
              ))}
            </>
          ) : (
            <>
              <ContactTabButton
                $activeBackground={"var(--light)"}
                $activeBoarder={"var(--dark)"}
                $tabIndex={"1"}
              >
                Suche
              </ContactTabButton>
            </>
          )}
        </ContactTabList>

        <ContactTabCard>
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
              <StyledTableBody key={"tableBody"}>
                {currentCategoryContacts.map((contact, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        title={contact[column.id]}
                        onClick={() => {
                          column.id === "website" && openUrl(contact[column.id]);
                          column.id === "instagram" && openInsta(contact[column.id]);
                          setActiveContact(contact);
                        }}
                      >
                        {column.id === "birth_date" && contact[column.id]
                          ? convertDateFormat(contact[column.id]) // Anzeige als tt.MM.yyyy
                          : column.id === "stand_helper"
                          ? contact[column.id]
                            ? "Ja"
                            : "Nein"
                          : Array.isArray(contact[column.id])
                          ? contact[column.id].join(", ")
                          : contact[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </StyledTableBody>
            </StyledTable>
          </TableBackground>
        </ContactTabCard>
      </ContactTabBackground>
      {showModal && (
        <AddNewContact
          key={"newContact"}
          handleCloseAddContactTask={() => setShowModal(false)}
          handleAddContact={handleAddContact}
        />
      )}
      {activeContact && (
        <DisplayContactModal
          key={"showContact"}
          contact={activeContact}
          handleOnClose={handleOnClose}
          handleEditContact={handleEditContact}
        ></DisplayContactModal>
      )}
    </>
  );
}
