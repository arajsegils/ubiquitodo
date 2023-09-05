import { useYPresenceContext } from "@/contexts/yPresenceContext";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { z } from "zod";

interface SharedObjectProps<T> {
  id: string | number;
  initial?: T[];
  parser?: z.ZodType<T>;
}

export default function useSharedArray<T extends object>({
  id,
  initial,
  parser,
}: SharedObjectProps<T>) {
  const { ydoc } = useYPresenceContext();
  console.log("Initializing useSharedArray Hook");

  const [sharedState, setSharedState] = useState<T[]>(initial || []);
  console.log("Initial sharedState:", sharedState);

  const yarray = ydoc.getArray(`${id}`);
  console.log(`Y.Array for id ${id} obtained`);

  useEffect(() => {
    console.log("Attaching observer to Y.Array");
    const observer = () => {
      console.log("Observer triggered");

      const raw = yarray.toArray().map((ymap) => {
        if (ymap instanceof Y.Map) {
          return ymap.toJSON();
        }
        return null;
      });

      if (parser) {
        try {
          console.log("Attempting to parse raw data");
          const parsed = raw.map((item) => parser.parse(item!));
          console.log("Parsing succeeded, updating state");
          setSharedState(parsed);
        } catch (err) {
          console.error("Zod parsing failed", err);
        }
      } else {
        console.log("No parser specified, updating state");
        setSharedState(raw as T[]);
      }
    };

    yarray.observe(observer);
    observer(); // Trigger once to populate

    return () => {
      console.log("Cleaning up observer");
      yarray.unobserve(observer);
    };
  }, [yarray, parser, id]);

  const handleSetSharedState = (newState: T[]) => {
    console.log("Setting new shared state");
    console.log({ newState });
    yarray.delete(0, yarray.length);
    newState.forEach((item) => {
      const ymap = new Y.Map();
      Object.entries(item).forEach(([key, value]) => {
        ymap.set(key, value);
      });
      yarray.push([ymap]);
    });
  };

  console.log("Returning sharedState and setSharedState");
  return { sharedState, setSharedState: handleSetSharedState };
}
