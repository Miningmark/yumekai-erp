"use client";

import styled from "styled-components";
import { StyledButton } from "@/components/styledComponents/StyledButton";
import AddNewUser from "@/components/adminComponents/AddNewUser";
import UserListModal from "@/components/adminComponents/UserListModal";
import { useState } from "react";
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
      <h1>Admin Board</h1>
      <StyledButton onClick={handleOpenAddUserModal}>Add New User</StyledButton>
      <br />
      <StyledButton onClick={handleOpenUserListModal}>View Users</StyledButton>

      {isAddUserModalOpen && <AddNewUser handleClose={handleCloseAddUserModal} />}
      {isUserListModalOpen && <UserListModal handleClose={handleCloseUserListModal} />}

      <BugModule />
    </PageBackground>
  );
}
