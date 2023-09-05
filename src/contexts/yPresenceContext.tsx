"use client";
import { User } from "@/types/dragAndDrop";
import useYPresence from "@/hooks/useYPresence";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Y from "yjs";
import { v4 } from "uuid";
import {
  animals,
  colors,
  languages,
  starWars,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { getRandomColor } from "@/lib/utils";
import { useLocalStorage } from "usehooks-ts";
import { Awareness } from "y-protocols/awareness.js";

interface YPresenceContextProps {
  ydoc: Y.Doc;
  users: User[];
  sessionId: string;
  user: User;
  setSessionId: Dispatch<SetStateAction<string>>;
  awareness: Awareness | null;
}

interface YPresenceProviderProps {
  children: React.ReactNode;
}

export const YPresenceContext = createContext<YPresenceContextProps | null>(
  null
);
export const YPresenceProvider = ({ children }: YPresenceProviderProps) => {
  const initialUser = useMemo(() => {
    return {
      id: v4(),
      name: uniqueNamesGenerator({
        dictionaries: [colors, animals],
        style: "capital",
        separator: " ",
      }),
      color: getRandomColor(),
    };
  }, []);
  const [user, setUser] = useLocalStorage("user", initialUser);

  const randomName = uniqueNamesGenerator({
    dictionaries: [colors, languages, starWars],
    style: "capital",
    separator: "",
  }).replace(/[^a-zA-Z0-9]/g, "");

  const [localSessionId, setSessionId] = useState<string>(randomName);
  const { ydoc, users, awareness } = useYPresence({
    currentUser: user,
    sessionId: localSessionId,
  });

  return (
    <YPresenceContext.Provider
      value={{
        ydoc,
        users,
        sessionId: localSessionId,
        setSessionId,
        user,
        awareness: awareness || null,
      }}
    >
      {children}
    </YPresenceContext.Provider>
  );
};

export const useYPresenceContext = () => {
  const context = useContext(YPresenceContext);
  if (!context) {
    throw new Error(
      "useYPresenceContext must be used within a YPresenceProvider"
    );
  }
  return context;
};
