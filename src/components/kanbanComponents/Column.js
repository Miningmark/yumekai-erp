import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TaskPreview from "@/components/kanbanComponents/TaskPreview";

const ColumnDiv = styled.div`
  position: relative;
  min-width: 250px;
  height: calc(100vh - 163px - 45px);
  gap: 10px;
  background-color: ${({ theme }) => theme.color1};
  padding: 10px 0 10px 0;
  border-radius: 10px;

  h3 {
    color: var(--secondary-color);
    text-align: center;
    margin: 15px 0 15px 0;
    cursor: text;
  }
`;

const ColumnContent = styled.div`
  max-height: calc(100% - 52px - 10px);

  overflow-y: auto;
  overflow-x: hidden;

  padding: 10px;

  /* Gradient overlay for top and bottom fade effect */
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 25px;
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    top: 62px;
    background: linear-gradient(to bottom, ${({ theme }) => theme.color1}, rgba(255, 255, 255, 0));
    display: none;
    transition: 1s;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, ${({ theme }) => theme.color1}, rgba(255, 255, 255, 0));
    display: block;
    transition: 1s;
  }

  &.scrolled-top::before {
    display: block;
    transition: 1s;
  }

  &.scrolled-bottom::after {
    display: none;
    transition: 1s;
  }

  /* Webkit-based browsers */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
`;

export default function Column({
  title,
  tasks,
  droppableId,
  handleEditTask,
  openTaskDetail,
  users,
  onTitleClick,
}) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const element = contentRef.current;
      if (element) {
        const isTop = element.scrollTop === 0;
        const isBottom = element.scrollTop + element.clientHeight === element.scrollHeight;

        if (!isTop) {
          element.classList.add("scrolled-top");
        } else {
          element.classList.remove("scrolled-top");
        }

        if (isBottom) {
          element.classList.add("scrolled-bottom");
        } else {
          element.classList.remove("scrolled-bottom");
        }
      }
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <ColumnDiv>
      <h3 onClick={onTitleClick}>
        {title} ({tasks.length})
      </h3>
      <ColumnContent ref={contentRef}>
        <Droppable droppableId={droppableId}>
          {(droppableProvider) => (
            <div
              style={{
                display: `flex`,
                flexDirection: `column`,
                gap: `10px`,
                minHeight: `200px`,
              }}
              ref={droppableProvider.innerRef}
              {...droppableProvider.droppableProps}
            >
              {tasks.map((el, index) => (
                <Draggable index={index} key={el.id} draggableId={el.id.toString()}>
                  {(draggableProvider) => (
                    <div
                      ref={draggableProvider.innerRef}
                      {...draggableProvider.draggableProps}
                      {...draggableProvider.dragHandleProps}
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <TaskPreview
                        task={el}
                        handleEditTask={handleEditTask}
                        openTaskDetail={openTaskDetail}
                        users={users}
                      ></TaskPreview>
                    </div>
                  )}
                </Draggable>
              ))}
              {droppableProvider.placeholder}
            </div>
          )}
        </Droppable>
      </ColumnContent>
    </ColumnDiv>
  );
}
