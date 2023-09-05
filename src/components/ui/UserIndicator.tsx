import { User } from "@/types/dragAndDrop";
import { AnimatePresence, motion } from "framer-motion";

export default function UserIndicator(props: { user: User; isMe: boolean }) {
  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "auto" }}
        exit={{ opacity: 0, width: 0 }}
        className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
      >
        <span
          className={`px-2 text-sm opacity-80 rounded-md border`}
          style={{ borderColor: props.user.color }}
        >
          {props.user.name}
          {props.isMe ? " (You)" : ""}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
