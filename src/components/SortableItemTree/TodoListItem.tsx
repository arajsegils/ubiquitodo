import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { GrDrag } from "react-icons/gr";
import { RxCross2 } from "react-icons/rx";
import { ItemContent } from "../../types/sortableTree";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Checkbox } from "../ui/checkbox";
import { is } from "drizzle-orm";
import usePresenceIndicators from "@/hooks/usePresenceIndicators";
import { User } from "@/types/dragAndDrop";

interface TodoListItemProps {
  id: UniqueIdentifier;
  content: ItemContent;
  onChangeTitle: (title: string) => void;
  onChangeSubtitle: (subtitle: string | null) => void;
  onChangeDone: (done: boolean) => void;
  onDelete?: () => void;
  dndAttributes: any;
  dndListeners: any;
  dndStyles: { transform?: string; transition?: string };
  ghost?: boolean;
  isDragging?: boolean;
  isPlaceholder?: boolean;
}
export const TodoListItem = forwardRef<HTMLDivElement, TodoListItemProps>(
  ({ onDelete, ...props }, ref) => {
    const [isHovered, setIsHovering] = useState<boolean>(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
    const [isEditingSubtitle, setIsEditingSubtitle] = useState<boolean>(false);

    const handleOnMouseEnter = () => {
      const newTimer = setTimeout(() => {
        setIsHovering(true);
      }, 200);
      setTimer(newTimer);
    };

    function handleOnMouseLeave() {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }
      setIsHovering(false);
    }

    function delayFnCall(fn: () => void, delay: number) {
      const newTimer = setTimeout(() => {
        fn();
      }, delay);
      setTimer(newTimer);
    }

    const isPlaceholder: boolean = !!props.isPlaceholder;

    const shouldBeDeleted: boolean =
      !isPlaceholder &&
      props.content.title === "" &&
      props.content.subtitle === "" &&
      !isEditingTitle &&
      !isEditingSubtitle;

    useEffect(() => {
      console.log("shouldBeDeleted", shouldBeDeleted);
      if (onDelete && shouldBeDeleted) {
        delayFnCall(() => {
          onDelete();
        }, 300);
      }
    }, [shouldBeDeleted]);

    useEffect(() => {
      // toggleInputFieldSelect(isEditingTitle || isEditingSubtitle);
    }, [isEditingSubtitle, isEditingTitle]);

    const { usersInCurrentField, toggleInputFieldSelect } =
      usePresenceIndicators(props.id);

    const showSubtitle: boolean =
      (!props.isDragging &&
        !isPlaceholder &&
        (!!isEditingTitle || !!isEditingSubtitle)) ||
      (!!props.content.subtitle && props.content.subtitle !== "");

    const showCheckbox: boolean = !isPlaceholder;

    const showDragHandle: boolean =
      !props.isDragging && !isPlaceholder && isHovered;

    const showDeleteButton: boolean =
      !!onDelete &&
      !props.ghost &&
      !props.isDragging &&
      !isPlaceholder &&
      isHovered;

    return (
      <div
        style={{
          ...props.dndStyles,
        }}
        className={`${
          props.isDragging ? "opacity-50 shadow-lg" : ""
        } flex flex-row items-center w-full gap-4 py-1 px-3 rounded-md bg-white hover:bg-slate-50`}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        <div
          ref={ref}
          {...props.dndAttributes}
          {...props.dndListeners}
          className={`transition-all ${
            showDragHandle
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <GrDrag />
        </div>
        <Checkbox
          id={`todo-checkbox-${props.id}`}
          checked={props.content.done}
          onCheckedChange={(checked) => {
            props.onChangeDone(checked as boolean);
          }}
          className={`transition-all ${
            showCheckbox ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
        <div className="flex flex-col w-full">
          <input
            autoComplete="off"
            spellCheck="false"
            id={`todo-title-${props.id}`}
            type="text"
            onFocus={() => setIsEditingTitle(true)}
            onBlur={() => delayFnCall(() => setIsEditingTitle(false), 300)}
            value={props.content.title}
            onChange={(e) => {
              props.onChangeTitle(e.target.value);
            }}
            placeholder="Something to do"
            className={`transition-all text-lg bg-inherit ${
              props.content.done ? "line-through text-gray-500" : ""
            }`}
          />
          <AnimatePresence>
            {showSubtitle && (
              <motion.input
                autoComplete="off"
                spellCheck="false"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                id={`todo-subtitle-${props.id}`}
                type="text"
                onClick={() => setIsEditingSubtitle(true)}
                onBlur={() => setIsEditingSubtitle(false)}
                className={`bg-inherit transition-colors ${
                  props.content.done ? "line-through text-gray-500" : ""
                }`}
                value={props.content.subtitle || ""}
                onChange={(e) => {
                  props.onChangeSubtitle(e.target.value);
                }}
                placeholder="Subtitle"
              />
            )}
          </AnimatePresence>
        </div>
        {usersInCurrentField.length > 0 && (
          <div className="flex gap-2 ml-auto">
            <AnimatePresence>
              {usersInCurrentField.map((user: User) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  key={user.id}
                  style={{
                    backgroundColor: user.color,
                  }}
                  className={`transition-colors rounded-full w-4 h-4`}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        {showDeleteButton && (
          <button
            onClick={onDelete}
            className={`transition-colors ml-auto ${
              showDeleteButton
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <RxCross2 />
          </button>
        )}
      </div>
    );
  }
);
TodoListItem.displayName = "Todo";
