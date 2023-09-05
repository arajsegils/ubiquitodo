import { FlatItem, Item } from "@/types/sortableTree";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TodoListItem } from "./TodoListItem";
import { removeItemInFlatList, updateContentByIdInFlatList } from "./utils";

interface SortableItemProps extends Omit<Item, "children"> {
  depth: number;
  flattenedItems: FlatItem[];
  setFlattenedItems: (items: FlatItem[]) => void;
  ghost?: boolean;
  isPlaceholder?: boolean;
}

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

export function SortableItemWrapper(props: SortableItemProps) {
  const {
    attributes,
    isDragging,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,
    animateLayoutChanges,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      className={`flex flex-row list-none  ${
        props.ghost ? "opacity-50 shadow-lg" : ""
      }}`}
      style={{
        width: "100%",
        paddingLeft: !props.ghost ? `${props.depth * 50}px` : undefined,
      }}
      ref={setDroppableNodeRef}
    >
      <TodoListItem
        id={props.id}
        content={props.content}
        dndAttributes={attributes}
        dndListeners={listeners}
        dndStyles={style}
        isDragging={isDragging}
        isPlaceholder={props.isPlaceholder}
        onChangeDone={(done) => {
          props.setFlattenedItems(
            updateContentByIdInFlatList(props.flattenedItems, props.id, {
              done,
            })
          );
        }}
        onChangeSubtitle={(subtitle) => {
          props.setFlattenedItems(
            updateContentByIdInFlatList(props.flattenedItems, props.id, {
              subtitle,
            })
          );
        }}
        onChangeTitle={(title) => {
          props.setFlattenedItems(
            updateContentByIdInFlatList(props.flattenedItems, props.id, {
              title,
            })
          );
        }}
        onDelete={() => {
          props.setFlattenedItems(
            removeItemInFlatList(props.flattenedItems, props.id)
          );
        }}
        ref={setDraggableNodeRef}
      />
    </li>
  );
}
