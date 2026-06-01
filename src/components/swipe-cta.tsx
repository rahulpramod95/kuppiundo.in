"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type SwipeCtaProps = {
  onComplete?: () => void;
  className?: string;
};

const THRESHOLD = 0.82;
const THUMB_SIZE = 48;
const TRACK_PADDING = 8;

export function SwipeCta({ onComplete, className }: SwipeCtaProps) {
  const t = useTranslations("detail");
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);
  const [done, setDone] = useState(false);
  const x = useMotionValue(0);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, track.clientWidth - THUMB_SIZE - TRACK_PADDING);
    setMaxDrag(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure]);

  const progress = useTransform(x, [0, Math.max(maxDrag, 1)], [0, 1]);
  const labelOpacity = useTransform(progress, [0, 0.45], [1, 0]);
  const fillWidth = useTransform(x, (value) => value + THUMB_SIZE + TRACK_PADDING / 2);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (done || maxDrag <= 0) return;

    if (info.offset.x >= maxDrag * THRESHOLD) {
      animate(x, maxDrag, {
        type: "spring",
        stiffness: 420,
        damping: 32,
        onComplete: () => {
          setDone(true);
          onComplete?.();
        },
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 520, damping: 36 });
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className={cn(
          "relative h-14 overflow-hidden rounded-full border shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0]",
          done
            ? "border-success/30 bg-success/10"
            : "border-hairline bg-surface-soft",
        )}
      >
        {!done ? (
          <motion.div
            style={{ width: fillWidth }}
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-primary/8"
          />
        ) : null}

        <motion.span
          style={{ opacity: done ? 0 : labelOpacity }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1 pl-14 text-sm font-medium text-body-text"
        >
          {t("swipe_hint")}
          <ChevronRight className="size-4" />
          <ChevronRight className="-ml-2 size-4 opacity-60" />
        </motion.span>

        <motion.div
          drag={done ? false : "x"}
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.04}
          dragMomentum={false}
          style={{ x }}
          onDragEnd={handleDragEnd}
          className={cn(
            "absolute top-1 left-1 z-10 flex size-12 touch-none cursor-grab items-center justify-center rounded-full text-xl select-none active:cursor-grabbing",
            done ? "cursor-default bg-success text-white" : "bg-primary text-primary-foreground",
          )}
        >
          {done ? <Check className="size-5" strokeWidth={2.5} /> : "🥃"}
        </motion.div>

        <motion.span
          style={{ opacity: done ? 1 : progress }}
          className={cn(
            "pointer-events-none absolute inset-y-0 right-5 flex items-center text-sm font-semibold",
            done ? "text-success" : "text-ink",
          )}
        >
          {done ? t("booked_label") : t("proceed_btn")}
        </motion.span>
      </div>
    </div>
  );
}
