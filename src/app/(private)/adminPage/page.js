"use client";

import styled from "styled-components";
import StyledButton from "@/components/styledComponents/StyledButton";
import AddNewUser from "@/components/adminComponents/AddNewUser";
import UserListModal from "@/components/adminComponents/UserListModal";
import { useState, useEffect } from "react";
import BugModule from "@/components/adminComponents/BugModuleAdmin";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isUserListModalOpen, setUserListModalOpen] = useState(false);

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

      <BugModule />
    </PageBackground>
  );
}
