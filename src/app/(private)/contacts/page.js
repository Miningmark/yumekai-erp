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

const ContactTabBackground = styled.div`
  width: calc(100% -40px);
  height: calc(100vh -158px);
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
  background-color: ${({ $activeBackground }) => $activeBackground};
  border: solid 2px ${({ $activeBoarder }) => $activeBoarder};
  color: var(--dark);
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
    background-color: var(--dark-grey);
    border: solid 2px var(--dark);
    border-bottom: none;
    transition: 0.5s;
  }
`;

const ContactTabCard = styled.div`
  position: absolute;
  top: 30px;
  width: calc(100% - 24px);
  height: calc(100vh - 158px - 70px);
  overflow: auto;
  background-color: var(--light); //var(--light)
  color: var(--dark);
  padding: 10px;
  border: solid 2px var(--dark);
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
    background-color: var(--grey);
    border: 1px solid var(--dark);
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
    border: 1px solid var(--dark);
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
      ].includes(column.id)
  ),
  Künstler: allColumns.filter(
    (column) =>
      !["id", "nickname", "category", "club", "created_at", "birth_date", "discord_name"].includes(
        column.id
      )
  ),
  Showact: allColumns.filter(
    (column) =>
      !["id", "nickname", "category", "created_at", "birth_date", "discord_name"].includes(
        column.id
      )
  ),
  Workshop: allColumns.filter(
    (column) =>
      !["id", "nickname", "category", "created_at", "birth_date", "company"].includes(column.id)
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
      ].includes(column.id)
  ),
  Cosplayer: allColumns.filter(
    (column) => !["id", "nickname", "category", "created_at", "birth_date"].includes(column.id)
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
  const [newContact, setNewContact] = useState(null);
  const [activeTab, setActiveTab] = useState("Händler");
  const [activeContact, setActiveContact] = useState(null);

  const search = React.useContext(PageContext);
  //console.log("12345", search);

  useEffect(() => {
    async function fetchContacts() {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data);
    }

    fetchContacts();
  }, []);

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

  function handleSearch(e) {
    setSearchQuery(e.target.value);
    const filtered = contacts.filter((contact) =>
      allColumns.some(
        (column) =>
          contact[column.id] &&
          contact[column.id].toString().toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setFilteredContacts(filtered);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  }

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
        } else {
          console.error("Failed to add contact: Response does not contain insertId. ");
        }
      } else {
        console.error("Failed to add contact. ", response.status);
      }
    } catch (error) {
      console.error("Failed to add contact:", error);
    }
  }

  //console.log("contacts", contacts);

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
    const response = await fetch("/api/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactToSave),
    });
    const data = await response.json();
    if (response.ok) {
      setContacts(
        contacts.map((contact) => (contact.id === editContact.id ? editContact : contact))
      );
    } else {
      console.error("Fehler beim Speichern des Kontakts. ", data);
    }
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
                  $activeBackground={category === activeTab ? "var(--light)" : "var(--grey)"}
                  $activeBoarder={category === activeTab ? "var(--dark)" : "var(--dark-grey)"}
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
                          console.log("Contact: ", contact, contact.id);
                          setActiveContact(contact);
                        }}
                      >
                        {column.id === "birth_date" && contact[column.id]
                          ? new Date(contact[column.id]).toLocaleDateString("de-DE") // Anzeige als tt.MM.yyyy
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
