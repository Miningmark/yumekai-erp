"use client";

import styled from "styled-components";
import StyledButton from "@/components/styledComponents/StyledButton";
import { useSession, getSession, signIn, signOut } from "next-auth/react";
import AddNewUser from "@/components/adminComponents/AddNewUser";
import UserListModal from "@/components/adminComponents/UserListModal";
import { useState } from "react";

const PageBackground = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  const { data: session } = useSession();
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

  if (session.user.role == "admin") {
    return (
      <PageBackground>
        <h1>Admin</h1>
        <button onClick={handleOpenAddUserModal}>Add New User</button>
        <button onClick={handleOpenUserListModal}>View Users</button>

        {isAddUserModalOpen && <AddNewUser handleClose={handleCloseAddUserModal} />}
        {isUserListModalOpen && <UserListModal handleClose={handleCloseUserListModal} />}
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <h1>kein zugriff</h1>
    </PageBackground>
  );
}
