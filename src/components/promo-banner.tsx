"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Bottle } from "@/lib/types";
import { formatPrice } from "@/lib/types";

const PROMO_THEMES = [
  {
    card: "border border-[#e8d5b8]/80 bg-gradient-to-br from-[#fdf6eb] via-[#f5e6cc] to-[#fffbf5]",
    glow: "bg-[#c9924a]/25",
  },
  {
    card: "border border-[#cfd8e6]/80 bg-gradient-to-br from-[#f2f6fc] via-[#e8eef8] to-[#fafcfe]",
    glow: "bg-[#7a9fd4]/18",
  },
  {
    card: "border border-[#e5d4cf]/80 bg-gradient-to-br from-[#faf3f0] via-[#f0e4de] to-[#fffaf8]",
    glow: "bg-[#c4846e]/18",
  },
];

const SWIPE_THRESHOLD = 50;

type PromoBannerProps = {
  bottles: Bottle[];
};

export function PromoBanner({ bottles }: PromoBannerProps) {
  const t = useTranslations("app");
  const reduceMotion = useReducedMotion();
  const featured = bottles.slice(0, 3);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragMovedRef = useRef(false);
  const bottle = featured[index] ?? featured[0];

  function goTo(next: number) {
    if (next < 0 || next >= featured.length || next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      dragMovedRef.current = true;
      goTo(index + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      dragMovedRef.current = true;
      goTo(index - 1);
    }
  }

  function handleDragStart() {
    dragMovedRef.current = false;
  }

  function handleDrag(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > 8) {
      dragMovedRef.current = true;
    }
  }

  function handleCardClick(event: MouseEvent<HTMLAnchorElement>) {
    if (dragMovedRef.current) {
      event.preventDefault();
    }
  }

  if (!bottle) return null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const theme = PROMO_THEMES[index % PROMO_THEMES.length];

  return (
    <div className="relative touch-pan-y">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={bottle.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          drag={reduceMotion ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className={`soft-card relative overflow-hidden ${theme.card}`}
        >
          <Link
            href={`/bottle/${bottle.id}`}
            draggable={false}
            onClick={handleCardClick}
            className="relative block cursor-pointer px-5 py-6 text-ink"
            aria-label={`${bottle.name}, ${formatPrice(bottle.price_750ml)}`}
          >
            <div
              className={`pointer-events-none absolute -right-4 bottom-0 h-44 w-44 rounded-full blur-3xl ${theme.glow}`}
            />
            <div className="relative z-10">
              <span className="inline-flex rounded-full bg-success px-3 py-1 text-xs font-semibold text-white">
                {t("promo_badge")}
              </span>
              <h2 className="font-display mt-3 max-w-[58%] text-2xl font-semibold leading-tight">
                {t("promo_title")}
              </h2>
              <p className="mt-2 text-sm text-body-text">{bottle.name}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{formatPrice(bottle.price_750ml)}</p>
            </div>

            <motion.div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-36 items-center justify-center"
              animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 4, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <Image
                src="/promo-bottle.webp"
                alt=""
                width={144}
                height={176}
                className="h-44 w-auto object-contain object-center drop-shadow-md"
                draggable={false}
                priority
              />
            </motion.div>
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="mt-3 flex justify-center gap-1.5">
        {featured.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i)}
            className="interactive-focus flex items-center justify-center rounded-full p-2"
            aria-label={item.name}
            aria-current={i === index ? "true" : undefined}
          >
            <span
              className={`block rounded-full transition-all ${i === index ? "h-1.5 w-5 bg-primary" : "size-1.5 bg-hairline"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
