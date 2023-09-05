import useSharedText from "@/hooks/useSharedText";
import { ComponentProps } from "react";

interface SharedInputProps {
  id: string | number;
}

export default function SharedInput({
  id,
  ...props
}: SharedInputProps & ComponentProps<"input">) {
  const { value, handleInputChange } = useSharedText({ id });
  return (
    <input
      id={`shared-input-${id}`}
      value={value}
      autoComplete="off"
      onChange={(e) => {
        handleInputChange(e);
      }}
      {...props}
    />
  );
}
