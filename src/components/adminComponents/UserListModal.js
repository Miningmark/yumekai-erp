import { useEffect, useState } from "react";
import styled from "styled-components";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditUserModal from "@/components/adminComponents/EditUserModal";
import { StyledButton, GreenButton, RedButton } from "@/components/styledComponents/StyledButton";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const UserListContainer = styled.div`
  background-color: ${({ theme }) => theme.color2};
  color: ${({ theme }) => theme.textColor};
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export default function UserListModal({ handleClose }) {
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users/userListFull");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }

    fetchUsers();
  }, []);

  function handleDeleteUser(user) {
    setUserToDelete(user);
    setConfirmDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    try {
      const name = userToDelete.name;
      const response = await fetch(`/api/users/editUser`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      // Remove the deleted user from the user list
      setUsers(users.filter((u) => u.id !== userToDelete.id));

      // Close the confirm delete modal
      setConfirmDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  function handleOpenEditUserModal(user) {
    setUserToEdit(user);
    setEditUserModalOpen(true);
  }

  function handleCloseEditUserModal() {
    setEditUserModalOpen(false);
  }
  function handleUpdateUsers(updatedUsers) {
    setUsers([...updatedUsers]);
  }

  return (
    <Overlay onClick={handleClose}>
      <UserListContainer onClick={(e) => e.stopPropagation()}>
        <h1>User List</h1>
        {users.map((user) => (
          <UserItem key={user.id}>
            <span>
              {user.name} ({user.email})
            </span>
            <ButtonContainer>
              <StyledButton onClick={() => handleOpenEditUserModal(user)}>Edit</StyledButton>
              <RedButton onClick={() => handleDeleteUser(user)}>Delete</RedButton>
            </ButtonContainer>
          </UserItem>
        ))}
        {isConfirmDeleteModalOpen && userToDelete && (
          <ConfirmDeleteModal
            handleClose={() => setConfirmDeleteModalOpen(false)}
            handleConfirm={handleConfirmDelete}
          />
        )}
        {isEditUserModalOpen && userToEdit && (
          <EditUserModal
            user={userToEdit}
            handleClose={handleCloseEditUserModal}
            users={users}
            handleUpdateUsers={handleUpdateUsers}
          />
        )}
      </UserListContainer>
    </Overlay>
  );
}
