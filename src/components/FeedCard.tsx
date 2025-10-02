import { motion, useMotionValue, useTransform, useDragControls, animate } from "framer-motion";
import { Card, CardBody } from "./ui/Card";
import Button from "./ui/Button";
import type { FeedItem } from "../types/api";
import { useCallback } from "react";

type Props = {
  user: FeedItem;
  onLeft: (userId: string) => void;
  onRight: (userId: string) => void;
};

const SWIPE_THRESHOLD = 150;

export default function FeedCard({ user, onLeft, onRight }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const opacity = useTransform(x, [-220, 0, 220], [0.4, 1, 0.4]);
  const controls = useDragControls();

  const completeSwipe = useCallback(
    async (dir: "left" | "right") => {
      const toX = dir === "right" ? 500 : -500;
      await animate(x, toX, { type: "spring", stiffness: 300, damping: 30 });
      dir === "right" ? onRight(user.id) : onLeft(user.id);
      x.set(0); // reset for next mount (if you recycle this component)
    },
    [onLeft, onRight, user.id, x]
  );

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragControls={controls}
      dragListener={false}               // we start drag manually from the image
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) completeSwipe("right");
        else if (info.offset.x < -SWIPE_THRESHOLD) completeSwipe("left");
        else animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
      }}
      className="mx-auto"
    >
      <Card className="w-80 sm:w-96 rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-surface-200 flex flex-col">
        {/* Image (drag handle) */}
        <div
          className="relative h-72 w-full cursor-grab active:cursor-grabbing select-none"
          onPointerDown={(e) => {
            // start dragging the parent when grabbing the image
            controls.start(e);
          }}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 h-full w-full bg-surface-300" />
          )}
          {/* Optional soft gradient for polish */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Info */}
        <CardBody className="p-5 flex flex-col gap-3">
          <div>
            <div className="text-xl font-semibold">{user.name}</div>
            <div className="text-white/60 text-sm">{user.title || "Developer"}</div>
          </div>
          <p className="text-white/80 text-sm leading-snug line-clamp-3">{user.bio}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="ghost"
              onClick={() => completeSwipe("left")}
              aria-label="Skip"
            >
              Skip
            </Button>
            <Button
              onClick={() => completeSwipe("right")}
              aria-label="Connect"
            >
              Connect
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
