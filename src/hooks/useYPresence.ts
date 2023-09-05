/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import { User } from "../types/dragAndDrop";
import { isEqual } from "lodash";

type PresenceState = Map<number, { user: User }>;

function mapToUsersArray(presence: PresenceState | null): User[] {
  if (!presence) return [];
  return Array.from(presence.values()).map((entry) => entry.user);
}

export default function useSharedPresence({
  currentUser,
  sessionId,
}: {
  sessionId: string;
  currentUser: User;
}) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const [users, setUsers] = useState<User[]>([]);
  const [awareness, setAwareness] = useState<Awareness | null>(null);

  useEffect(() => {
    console.log(
      "Setting up IndexeddbPersistence, WebsocketProvider and ytext observer"
    );
    const _localProvider = new IndexeddbPersistence(
      `ubiquitodo-${sessionId}`,
      ydoc
    );
    console.log(process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL);
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_YJS_WEBSOCKET_URL || "ws://localhost:1234",
      sessionId,
      ydoc
    );
    provider.awareness.setLocalStateField("user", currentUser);
    setAwareness(provider.awareness);

    provider.awareness.on("change", () => {
      const states = provider.awareness.getStates();
      console.log("Awareness change triggered", states);
      const newPresenceArray = mapToUsersArray(states);
      setUsers(newPresenceArray); // change presence state to be an array
    });

    return () => {
      console.log("Disconnecting provider");
      provider.disconnect();
    };
  }, [sessionId]);

  return { ydoc, users, awareness };
}
