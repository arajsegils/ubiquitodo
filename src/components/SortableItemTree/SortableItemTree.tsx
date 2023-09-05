"use client";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  DropAnimation,
  defaultDropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItemWrapper } from "./SortableItemWrapper";
import { createPortal } from "react-dom";
import { nanoid } from "nanoid";
import useSharedTodoItems from "./useSharedTodoItems";

const dropAnimationConfig: DropAnimation = defaultDropAnimation;

export default function SortableItemTree(props: {
  showCompleteTasks?: boolean;
}) {
  const {
    activeId,
    activeItem,
    sortedIds,
    sensors,
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleDragMove,
    projected,
    flattenedItems,
    flattenedIncompleteItems,
    setFlattenedItems,
  } = useSharedTodoItems();

  const itemsToDisplay = props.showCompleteTasks
    ? flattenedItems
    : flattenedIncompleteItems;

  return (
    <ul className="grid w-full gap-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
      >
        <SortableContext
          items={sortedIds}
          strategy={verticalListSortingStrategy}
        >
          {itemsToDisplay
            .concat({
              id: nanoid(),
              depth: 0,
              parentId: null,
              children: [],
              isPlaceholder: true,
              content: {
                title: "",
                done: false,
              },
              index: flattenedItems.length,
            })
            .map((item) => (
              <SortableItemWrapper
                setFlattenedItems={setFlattenedItems}
                flattenedItems={flattenedItems}
                key={item.id}
                content={item.content}
                id={item.id}
                isPlaceholder={item.isPlaceholder}
                depth={
                  item.id === activeId && projected
                    ? projected.depth
                    : item.depth
                }
              />
            ))}
          {typeof document !== "undefined" &&
            createPortal(
              <DragOverlay dropAnimation={dropAnimationConfig}>
                {activeId && activeItem ? (
                  <SortableItemWrapper
                    setFlattenedItems={setFlattenedItems}
                    flattenedItems={flattenedItems}
                    depth={activeItem.depth}
                    id={activeId}
                    content={activeItem.content}
                    ghost
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
        </SortableContext>
      </DndContext>
    </ul>
  );
}
