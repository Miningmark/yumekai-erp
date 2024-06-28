"use client";

import { useState, useEffect } from "react";
import AddNewContact from "@/components/contactComponents/AddNewContact";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState(null);

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
