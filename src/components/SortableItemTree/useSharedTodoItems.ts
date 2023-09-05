import {
  UniqueIdentifier,
  useSensors,
  useSensor,
  PointerSensor,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  DragMoveEvent,
  Modifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState, useMemo } from "react";
import { FlatItem } from "../../types/sortableTree";
import {
  getProjection,
  buildTree,
  filterOutCompletedTasks,
  flattenTree,
} from "./utils";
import useSharedArray from "../../hooks/useSharedArray";
import { useYPresenceContext } from "@/contexts/yPresenceContext";

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};

export default function useSharedTodoItems() {
  const { sessionId } = useYPresenceContext();
  const { sharedState: flattenedItems, setSharedState: setFlattenedItems } =
    useSharedArray<FlatItem>({ id: sessionId });
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const indentationWidth = 20;

  const sensors = useSensors(useSensor(PointerSensor));

  const items = useMemo(() => buildTree(flattenedItems), [flattenedItems]);
  const flattenedIncompleteItems = useMemo(() => {
    const tree = buildTree(flattenedItems);
    const filtered = filterOutCompletedTasks(tree);
    return flattenTree(filtered);
  }, [flattenedItems]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;

  function handleDragEnd(event: DragEndEvent) {
    resetDragState();

    if (projected && event.over) {
      const { depth, parentId } = projected;
      const clonedItems: FlatItem[] = JSON.parse(
        JSON.stringify(flattenedItems)
      );
      const overIndex = clonedItems.findIndex(
        ({ id }) => id === event.over?.id
      );
      const activeIndex = clonedItems.findIndex(
        ({ id }) => id === event.active.id
      );
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      console.log({ sortedItems });

      setFlattenedItems(sortedItems);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
    setOverId(activeId);
    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragCancel() {
    resetDragState();
  }

  function resetDragState() {
    setOverId(null);
    setActiveId(null);
    document.body.style.setProperty("cursor", "");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  return {
    items,
    flattenedItems,
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
    setFlattenedItems,
    adjustTranslate,
    flattenedIncompleteItems,
  };
}
