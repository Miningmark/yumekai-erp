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
  background-color: red;
`;

const ContactTabList = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContactTabButton = styled.div`
  width: 150px;
  height: 30px;
  background-color: blue;
  border: solid 2px green;
  border-radius: 10px 10px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: 0.5s;
  cursor: pointer;

  &:hover {
    background-color: lightblue;
    border: solid 2px lightgreen;
    transition: 0.5s;
  }
`;

const ContactTabCard = styled.div`
  width: calc(100% - 20px);
  height: 100%;
  overflow: auto;
  background-color: var(--light);
  color: var(--dark);
  padding: 10px;
`;
export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState(null);
  const [activTab, setActivTab] = useState(0);

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

  function changeTab(tabNumber) {
    setActivTab(tabNumber);
  }

  return (
    <>
      <h1>Kontakte</h1>
      <button onClick={() => setShowModal(true)}>Add Contact</button>
      <ContactTabBackground>
        <ContactTabList>
          <ContactTabButton onClick={() => changeTab(0)}>Händler</ContactTabButton>
          <ContactTabButton onClick={() => changeTab(1)}>Künstler</ContactTabButton>
          <ContactTabButton onClick={() => changeTab(2)}>Showacts</ContactTabButton>
          <ContactTabButton onClick={() => changeTab(3)}>Helfer</ContactTabButton>
        </ContactTabList>
        {activTab == 0 && (
          <ContactTabCard>
            <h3>Händler</h3>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Firma/Verein Name</th>
                  <th>E-Mail</th>
                  <th>Telefon</th>
                  <th>Webseite</th>
                  <th>Instagram</th>
                  <th>PLZ</th>
                  <th>City</th>
                  <th>Street</th>
                  <th>House Number</th>
                  <th>Land</th>
                  <th>Contact By</th>
                  <th>Notes</th>
                  <th>Previous Collaboration</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact, index) => (
                  <tr key={index}>
                    <td>{contact.category}</td>
                    <td>{contact.name}</td>
                    <td>{contact.company}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone}</td>
                    <td>{contact.website}</td>
                    <td>{contact.instagram}</td>
                    <td>{contact.plz}</td>
                    <td>{contact.city}</td>
                    <td>{contact.street}</td>
                    <td>{contact.country}</td>
                    <td>{contact.house_number}</td>
                    <td>{contact.contact_by}</td>
                    <td>{contact.notes}</td>
                    <td>{contact.previous_collaboration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ContactTabCard>
        )}
        {activTab == 1 && (
          <ContactTabCard>
            <p>Künstler</p>
          </ContactTabCard>
        )}
        {activTab == 2 && (
          <ContactTabCard>
            <p>Showacts</p>
          </ContactTabCard>
        )}
        {activTab == 3 && (
          <ContactTabCard>
            <p>Helfer</p>
          </ContactTabCard>
        )}
      </ContactTabBackground>
      {showModal && (
        <AddNewContact
          handleCloseAddContactTask={() => setShowModal(false)}
          handleAddContact={handleAddContact}
        />
      )}
    </>
  );

  return (
    <>
      <h1>Kontakte</h1>
      <input type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
      <button onClick={() => setShowModal(true)}>Add Contact</button>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Firma/Verein Name</th>
            <th>E-Mail</th>
            <th>Telefon</th>
            <th>Webseite</th>
            <th>Instagram</th>
            <th>PLZ</th>
            <th>City</th>
            <th>Street</th>
            <th>House Number</th>
            <th>Land</th>
            <th>Contact By</th>
            <th>Notes</th>
            <th>Previous Collaboration</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact, index) => (
            <tr key={index}>
              <td>{contact.category}</td>
              <td>{contact.name}</td>
              <td>{contact.company}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.website}</td>
              <td>{contact.instagram}</td>
              <td>{contact.plz}</td>
              <td>{contact.city}</td>
              <td>{contact.street}</td>
              <td>{contact.country}</td>
              <td>{contact.house_number}</td>
              <td>{contact.contact_by}</td>
              <td>{contact.notes}</td>
              <td>{contact.previous_collaboration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <AddNewContact
          handleCloseAddContactTask={() => setShowModal(false)}
          handleAddContact={handleAddContact}
        />
      )}
    </>
  );
}
