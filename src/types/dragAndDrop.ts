import { UniqueIdentifier } from "@dnd-kit/core";

export interface User {
  name: string;
  id: UniqueIdentifier;
  color: string;
  selectedInputFieldId?: UniqueIdentifier;
}

export interface CursorPosition {
  position: number;
  inputFieldId: number | string;
}

export interface CursorState {
  [clientId: number]: CursorPosition | { color: string };
}

export type PresenceState = Map<number, { user: User }>;
