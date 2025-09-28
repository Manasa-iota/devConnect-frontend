import { motion, useMotionValue, useTransform } from "framer-motion";
import type { FeedItem } from "../types/api";

type Props = {
  user: FeedItem;
  onLeft: (userId: string) => void;
  onRight: (userId: string) => void;
};

export default function FeedCard({ user, onLeft, onRight }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const opacity = useTransform(x, [-200, 0, 200], [0.3, 1, 0.3]);

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (info.offset.x > 140) onRight(user.id);
        else if (info.offset.x < -140) onLeft(user.id);
      }}
      className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-xl select-none"
    >
      <div className="flex items-center gap-4">
        {user.avatar ? <img src={user.avatar} alt={user.name} className="h-14 w-14 rounded-full object-cover" /> : <div className="h-14 w-14 rounded-full bg-zinc-800" />}
        <div className="flex-1">
          <div className="text-white font-semibold">{user.name}</div>
          <div className="text-white/60 text-sm">{user.title}</div>
        </div>
      </div>
      <div className="mt-3 text-white/80 text-sm line-clamp-3">{user.bio}</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => onLeft(user.id)} className="rounded-xl border border-white/15 bg-zinc-800 py-2 text-white/90 hover:text-white">Skip</button>
        <button onClick={() => onRight(user.id)} className="rounded-xl bg-[#a4f839] text-black font-semibold py-2">Connect</button>
      </div>
    </motion.div>
  );
}
