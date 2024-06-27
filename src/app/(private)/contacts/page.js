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

    if (response.ok) {
      const data = await response.json();
      setContacts([...contacts, data]);
      setFilteredContacts([...contacts, data]);
      setShowModal(false);
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
            <th>Name</th>
            <th>Firma/Verein</th>
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
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact.id}>
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
              <td>{contact.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <h2>Add New Contact</h2>
          <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />
          <input type="text" name="company" placeholder="Company" onChange={handleInputChange} />
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} />
          <input type="tel" name="phone" placeholder="Phone" onChange={handleInputChange} />
          <input type="text" name="website" placeholder="Website" onChange={handleInputChange} />
          <input
            type="text"
            name="instagram"
            placeholder="Instagram"
            onChange={handleInputChange}
          />
          <input type="text" name="city" placeholder="City" onChange={handleInputChange} />
          <input type="text" name="street" placeholder="Street" onChange={handleInputChange} />
          <input
            type="text"
            name="house_number"
            placeholder="House Number"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="contact_by"
            placeholder="Contact By"
            onChange={handleInputChange}
          />
          <textarea name="notes" placeholder="Notes" onChange={handleInputChange} />
          <textarea
            name="previous_collaboration"
            placeholder="Previous Collaboration"
            onChange={handleInputChange}
          />
          <input type="text" name="category" placeholder="Category" onChange={handleInputChange} />
          <button onClick={handleAddContact}>Add</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}
      {showModal && (
        <AddNewContact
          handleCloseAddContactTask={() => setShowModal(false)}
          handleAddContact={handleAddContact}
        />
      )}
    </>
  );
}
