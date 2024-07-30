import styled from "styled-components";

import { platforms } from "@/utils/socialMedia/platforms";

const TaskCard = styled.div`
  border-radius: var(--border-radius);
  padding: 5px;
  background-color: ${({ $postcolor }) => `${$postcolor}`};

  h4 {
    margin: 0;
  }
`;

export default function PostPreview({ task, openTaskDetail }) {
  const { title, editor, subtaskschecked, planned } = task;

  const subtasksDone = subtaskschecked.filter((checked) => checked === true).length;

  const usedPlatform = platforms.find((platform) => platform.name === editor);

  const postColor = usedPlatform ? `${usedPlatform.color}` : "#AAAAAA";

  function OnOpenTaskDetail() {
    openTaskDetail(task.id);
  }

  return (
    <>
      <TaskCard $postcolor={postColor} onClick={OnOpenTaskDetail}>
        <h4>{title}</h4>
        <p>{new Date(planned).toLocaleDateString("de-DE")}</p>
        <p>
          {subtasksDone}/{subtaskschecked.length} Teilaufgaben erledigt
        </p>
      </TaskCard>
    </>
  );
}
