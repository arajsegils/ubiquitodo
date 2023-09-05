"use client";

import { useYPresenceContext } from "@/contexts/yPresenceContext";
import UserIndicator from "./UserIndicator";

export default function Header() {
  const { users, user: currentUser } = useYPresenceContext();
  return (
    <header className="flex col-span-full justify-between w-full py-4 px-10 border-b border-gray-100 bg-white items-center">
      <h1 className="text-xl">
        Ubiqui<span className="font-bold">todo</span>
      </h1>
      <div className="flex gap-3">
        {users.map((user) => {
          return (
            <UserIndicator
              key={user.id}
              user={user}
              isMe={user.id === currentUser.id}
            />
          );
        })}
      </div>
    </header>
  );
}
