import React, { useState } from "react";
import styled from "styled-components";

const TaskCard = styled.div`
  border-radius: var(--border-radius);
  padding: 5px;
  background-color: ${({ $taskcolor }) => `${$taskcolor}`};

  h4 {
    margin: 0;
  }
`;

export default function TaskPreview({ task, openTaskDetail, users }) {
  const { title, editor, subtaskschecked } = task;

  const subtasksDone = subtaskschecked.filter((checked) => checked === true).length;

  const editorUser = users.find((user) => user.name === editor);

  const taskColor = editorUser ? `${editorUser.color}` : "#AAAAAA";

  function OnOpenTaskDetail() {
    openTaskDetail(task.id);
  }

  return (
    <>
      <TaskCard $taskcolor={taskColor} onClick={OnOpenTaskDetail}>
        <h4>{title}</h4>
        <p>
          {subtasksDone}/{subtaskschecked.length} Teilaufgaben erledigt
        </p>
      </TaskCard>
    </>
  );
}
