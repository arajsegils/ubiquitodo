import { useMemo } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useYPresenceContext } from "@/contexts/yPresenceContext";

export default function usePresenceIndicators(id: UniqueIdentifier) {
  const { user, users: allUsers, awareness } = useYPresenceContext();

  const usersInCurrentField = useMemo(
    () =>
      allUsers.filter(
        (u) => u.selectedInputFieldId === id && u.id !== user?.id
      ),
    [allUsers, id, user?.id]
  );

  function toggleInputFieldSelect(toggle: boolean) {
    const newUser = {
      id: user?.id,
      color: user?.color,
      selectedInputFieldId: id,
    };
    console.log("New User", newUser);
    awareness?.setLocalStateField("user-selection", newUser);
  }

  return { usersInCurrentField, toggleInputFieldSelect };
}
