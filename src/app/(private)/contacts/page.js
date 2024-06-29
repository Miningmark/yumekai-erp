"use client";

import { useState, useEffect } from "react";
import AddNewContact from "@/components/contactComponents/AddNewContact";
import styled from "styled-components";

const ContactTabBackground = styled.div`
  width: calc(100% -40px);
  height: calc(100vh -158px);
  margin: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
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
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: 0.5s;
  cursor: pointer;

  &:hover {
    background-color: red;
    border: solid 2px var(--dark);
    border-bottom: none;
    transition: 0.5s;
  }
`;

const ContactTabCard = styled.div`
  width: calc(100% - 24px);
  height: 100%;
  overflow: auto;
  background-color: var(--light);
  color: var(--dark);
  padding: 10px;
  border: solid 2px var(--dark);
  border-top: none;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTableHead = styled.thead`
  th {
    font-weight: bold;
    border: 1px solid white;
    padding: 8px;
  }
`;

const StyledTableBody = styled.tbody`
  td {
    border: 1px solid white;
    padding: 8px;
  }
`;

const allColumns = [
  { id: "id", name: "ID" },
  { id: "category", name: "Kategorie" },
  { id: "name", name: "Name" },
  { id: "company", name: "Firma" },
  { id: "email", name: "E-Mail" },
  { id: "phone", name: "Telefon" },
  { id: "website", name: "Website" },
  { id: "instagram", name: "Instagram" },
  { id: "postal_code", name: "Postleitzahl" },
  { id: "city", name: "Stadt" },
  { id: "street", name: "Straße" },
  { id: "house_number", name: "Hausnummer" },
  { id: "country", name: "Land" },
  { id: "contact_by", name: "Kontakt durch" },
  { id: "notes", name: "Notizen" },
  { id: "previous_collaboration", name: "Frühere Zusammenarbeit" },
  { id: "created_at", name: "Erstellt am" },
  { id: "birth_date", name: "Geburtsdatum" },
  { id: "discord_name", name: "Discord Name" },
  { id: "gender", name: "Geschlecht" },
];

const columnsByCategory = {
  Händler: allColumns.filter(
    (column) => !["id", "category", "created_at", "birth_date", "discord_name"].includes(column.id)
  ),
  Künstler: allColumns.filter(
    (column) => !["id", "category", "created_at", "birth_date", "discord_name"].includes(column.id)
  ),
  Showact: allColumns.filter(
    (column) => !["id", "category", "created_at", "birth_date", "discord_name"].includes(column.id)
  ),
  Sonstiges: allColumns.filter((column) => !["id", "category", "created_at"].includes(column.id)),
  Workshop: allColumns.filter(
    (column) => !["id", "category", "created_at", "birth_date", "company"].includes(column.id)
  ),
  Verein: allColumns.filter(
    (column) => !["created_at", "birth_date", "discord_name"].includes(column.id)
  ),
  Cosplayer: allColumns.filter(
    (column) => !["id", "category", "created_at", "birth_date"].includes(column.id)
  ),
  Helfer: allColumns.filter(
    (column) =>
      !["id", "category", "created_at", "company", "website", "instagram"].includes(column.id)
  ),
};

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState(null);
  const [activeTab, setActiveTab] = useState("Händler");

  useEffect(() => {
    async function fetchContacts() {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data);
    }

    fetchContacts();
  }, []);

  function handleSearch(e) {
    setSearchQuery(e.target.value);
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        contact.company.toLowerCase().includes(e.target.value.toLowerCase()) ||
        contact.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredContacts(filtered);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  }

  async function handleAddContact(newContact) {
    const response = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    const data = await response.json();
    if (response.ok) {
      setContacts([...contacts, newContact]);
      setFilteredContacts([...contacts, newContact]);
      setShowModal(false);
    } else {
      console.error("Fehler beim Speichern des Kontakts. ", data);
    }
  }

  console.log("contacts", contacts);

  function changeTab(category) {
    setActiveTab(category);
  }

  const currentCategoryContacts = filteredContacts.filter(
    (contact) => contact.category === activeTab
  );
  const columns = columnsByCategory[activeTab];

  return (
    <>
      <h1>Kontakte</h1>
      <button onClick={() => setShowModal(true)}>Add Contact</button>
      <ContactTabBackground>
        <ContactTabList>
          {Object.keys(columnsByCategory).map((category) => (
            <ContactTabButton
              key={category}
              onClick={() => changeTab(category)}
              $activeBackground={category === activeTab ? "var(--light)" : "var(--grey)"}
              $activeBoarder={category === activeTab ? "var(--dark)" : "blue"}
            >
              {category}
            </ContactTabButton>
          ))}
        </ContactTabList>
        <ContactTabCard>
          <h3>{activeTab}</h3>
          <StyledTable>
            <StyledTableHead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{column.name}</th>
                ))}
              </tr>
            </StyledTableHead>
            <StyledTableBody>
              {currentCategoryContacts.map((contact, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.id}>{contact[column.id]}</td>
                  ))}
                </tr>
              ))}
            </StyledTableBody>
          </StyledTable>
        </ContactTabCard>
      </ContactTabBackground>
      {showModal && (
        <AddNewContact
          handleCloseAddContactTask={() => setShowModal(false)}
          handleAddContact={handleAddContact}
        />
      )}
    </>
  );
}
