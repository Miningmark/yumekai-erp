"use client";

import styled from "styled-components";
import StyledButton from "@/components/styledComponents/StyledButton";
import AddNewUser from "@/components/adminComponents/AddNewUser";
import UserListModal from "@/components/adminComponents/UserListModal";
import { useState, useEffect } from "react";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
`;

const BugContainer = styled.div`
  background-color: var(--light);
  border-radius: 10px;
  color: var(--dark);

  h2 {
    text-align: center;
  }
`;

const BugList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BugListItem = styled.li`
  border: 1px solid #ccc;
  padding: 0 10px;
  border-radius: 5px;
  margin: 0 20px;
  background-color: var(--grey);
`;

export default function Home() {
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await fetch("/api/bugReport");
        if (response.ok) {
          const data = await response.json();
          setBugs(data);
        } else {
          console.error("Failed to fetch bug reports");
        }
      } catch (error) {
        console.error("Error fetching bug reports", error);
      }
    };
    fetchBugs();
  }, []);

  function handleOpenAddUserModal() {
    setAddUserModalOpen(true);
  }

  function handleCloseAddUserModal() {
    setAddUserModalOpen(false);
  }

  function handleOpenUserListModal() {
    setUserListModalOpen(true);
  }

  function handleCloseUserListModal() {
    setUserListModalOpen(false);
  }

  return (
    <PageBackground>
      <h1>Admin</h1>
      <button onClick={handleOpenAddUserModal}>Add New User</button>
      <button onClick={handleOpenUserListModal}>View Users</button>

      {isAddUserModalOpen && <AddNewUser handleClose={handleCloseAddUserModal} />}
      {isUserListModalOpen && <UserListModal handleClose={handleCloseUserListModal} />}

      <BugContainer>
        <h2>Reported Bugs</h2>
        <BugList>
          {bugs.map((bug) => (
            <BugListItem key={bug.id}>
              <h3>{bug.title}</h3>
              <p>{bug.description}</p>
              <p>
                Gemeldet von: {bug.reporter} am: {new Date(bug.created_at).toLocaleString("de-DE")}
              </p>
            </BugListItem>
          ))}
        </BugList>
      </BugContainer>
    </PageBackground>
  );
}
