/* eslint-disable react-hooks/exhaustive-deps */
import { useYPresenceContext } from "@/contexts/yPresenceContext";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

interface SharedInputProps {
  id: string | number;
}

export default function useSharedText({ id: fieldId }: SharedInputProps) {
  const [value, setValue] = useState("");
  const { ydoc, sessionId } = useYPresenceContext();
  const ytext = useMemo(
    () => ydoc.getText(`${sessionId}-${fieldId}`),
    [sessionId, fieldId]
  );

  useEffect(() => {
    ytext.observe((_event) => {
      console.log("ytext observe triggered", ytext.toString());
      setValue(ytext.toString());
    });
  }, [sessionId, fieldId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const oldYText = ytext.toString();

    let startIdx = 0;
    while (
      inputValue[startIdx] === oldYText[startIdx] &&
      startIdx < Math.min(inputValue.length, oldYText.length)
    ) {
      startIdx++;
    }

    let inputReverseIdx = inputValue.length - 1;
    let ytextReverseIdx = oldYText.length - 1;

    while (
      inputValue[inputReverseIdx] === oldYText[ytextReverseIdx] &&
      inputReverseIdx >= startIdx &&
      ytextReverseIdx >= startIdx
    ) {
      inputReverseIdx--;
      ytextReverseIdx--;
    }

    const inserted = inputValue.slice(startIdx, inputReverseIdx + 1);
    const removed = ytextReverseIdx - startIdx + 1;

    if (removed > 0) {
      ytext.delete(startIdx, removed);
    }
    if (inserted) {
      ytext.insert(startIdx, inserted);
    }
  };

  return { value, handleInputChange };
}
