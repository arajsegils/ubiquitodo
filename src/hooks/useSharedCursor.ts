/* eslint-disable react-hooks/exhaustive-deps */
import { CursorState } from "@/types/dragAndDrop";
import { useEffect, useState } from "react";
import { Awareness } from "y-protocols/awareness";

export default function useSharedCursor(
  activeUserId: number,
  inputFieldId: string | number,
  awareness: Awareness | null
) {
  const [cursors, setCursors] = useState<CursorState>({});

  useEffect(() => {
    console.log("useEffect triggered");

    const handleAwarenessChange = () => {
      console.log("handleAwarenessChange called");

      const newCursorState: CursorState = {};

      if (!awareness) {
        console.log("Exiting early: no awareness");
        return;
      }

      const states = awareness.getStates();
      console.log("Received states:", states);

      for (const [_sessionId, state] of states) {
        const userId = state.user.id;
        console.log("Evaluating isForeignCursorInCurrentField...");
        console.log({ state, activeUserId });

        const hasCursor = !!state.cursor;
        console.log(`state.cursor exists: ${hasCursor}`);

        const isInCurrentField = state.cursor?.inputFieldId === inputFieldId;
        console.log(`Cursor in current input field: ${isInCurrentField}`);

        const isForeignCursor = userId !== activeUserId;
        console.log(`Is foreign cursor: ${isForeignCursor}`);
        console.log(`User ID: ${userId}, active user ID: ${activeUserId}`);

        const isForeignCursorInCurrentField =
          hasCursor && isInCurrentField && isForeignCursor;
        console.log(
          `Final evaluation of isForeignCursorInCurrentField: ${isForeignCursorInCurrentField}`
        );

        if (isForeignCursorInCurrentField) {
          console.log(
            `Foreign cursor detected in input ${inputFieldId} by user ${userId}`
          );
          newCursorState[userId] = {
            ...state.cursor,
            color: state.user?.color ?? "defaultColor",
          };
        }
      }

      console.log("Setting cursors:", newCursorState);
      setCursors(newCursorState);
    };

    awareness && awareness.on("change", handleAwarenessChange);
    console.log("Event listener attached");

    return () => {
      console.log("Cleaning up event listener");
      awareness && awareness.off("change", handleAwarenessChange);
    };
  }, [inputFieldId, awareness]);

  return cursors;
}
