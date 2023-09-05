/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import SortableItemTree from "@/components/SortableItemTree/SortableItemTree";
import SharedInput from "@/components/SharedState/SharedInput";
import { useYPresenceContext } from "@/contexts/yPresenceContext";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function Page({ params }: { params: { session: string } }) {
  const { setSessionId } = useYPresenceContext();
  useEffect(() => {
    setSessionId(params.session); // TODO: Not a fan of this. Should be initialized once on random route assignment, but it is regenerated on page load
  }, []);
  const [showCompleteTasks, setShowComplete] = useState(true);
  return (
    <main className="flex flex-col p-4 md:p-24 gap-8">
      <div className="flex ml-12 mb-10 items-center">
        <SharedInput
          className="text-2xl font-medium w-full"
          id="title"
          placeholder="New Todo List"
          spellCheck={false}
        />
        <Switch
          id="showComplete"
          className="ml-auto"
          checked={showCompleteTasks}
          onCheckedChange={() => setShowComplete(!showCompleteTasks)}
        />
        <label className="text-sm ml-3" htmlFor="showComplete">
          Show complete
        </label>
      </div>
      <SortableItemTree showCompleteTasks={showCompleteTasks} />
    </main>
  );
}
