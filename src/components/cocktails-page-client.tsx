"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SecondaryPageHeader } from "@/components/secondary-page-header";
import type { Bottle, Cocktail, SpiritType } from "@/lib/types";
import { cn } from "@/lib/utils";

type CocktailsPageClientProps = {
  spiritType: SpiritType;
  cocktails: Cocktail[];
  bottles: Bottle[];
};

const SWIPE_THRESHOLD = 80;

export function CocktailsPageClient({
  spiritType,
  cocktails,
  bottles,
}: CocktailsPageClientProps) {
  const t = useTranslations("cocktails");
  const tc = useTranslations("categories");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const cocktail = cocktails[index];
  const bottleMap = new Map(bottles.map((b) => [b.id, b]));

  function goTo(i: number) {
    if (i < 0 || i >= cocktails.length) return;
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD && index < cocktails.length - 1) {
      goTo(index + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD && index > 0) {
      goTo(index - 1);
    }
  }

  if (!cocktail) {
    return (
      <div className="px-5 py-10 text-center">
        <p className="text-body-text">{t("empty")}</p>
        <Link href="/">
          <Button className="mt-4">{t("back_home")}</Button>
        </Link>
      </div>
    );
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
  };

  return (
    <div className="flex min-h-[70vh] flex-col pb-8">
      <SecondaryPageHeader
        backHref="/"
        backLabel={t("back_home")}
        title={t(`label_${spiritType}`)}
        subtitle={`${t("swipe_hint")} · ${index + 1}/${cocktails.length}`}
      />

      <div className="space-y-4 px-5 pt-4">
        <div className="flex justify-center gap-1.5">
          {cocktails.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-primary" : "w-1.5 bg-hairline",
              )}
              aria-label={item.name}
            />
          ))}
        </div>

        <div className="relative min-h-[520px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={cocktail.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={handleDragEnd}
              className="soft-card cursor-grab p-5 active:cursor-grabbing"
            >
              <div className="text-center">
                <span className="text-6xl">{cocktail.emoji}</span>
                <h2 className="font-display mt-3 text-2xl font-bold">{cocktail.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-body-text">{cocktail.description}</p>
                <span className="mt-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-body-text">
                  {tc(spiritType)}
                </span>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("ingredients_title")}
                </p>
                <div className="space-y-2">
                  {cocktail.ingredients.map((ingredient) => {
                    const bottle = ingredient.bottleId
                      ? bottleMap.get(ingredient.bottleId)
                      : undefined;
                    const inner = (
                      <div className="flex items-center gap-3 rounded-md border border-hairline bg-surface-soft p-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-xl">
                          {ingredient.emoji}
                        </span>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="truncate text-sm font-semibold">{ingredient.name}</p>
                          <p className="text-xs text-body-text">{ingredient.amount}</p>
                          {bottle && (
                            <p className="mt-0.5 text-xs text-legal-link">{t("available_kerala")}</p>
                          )}
                        </div>
                        {bottle && (
                          <span className="text-lg">{bottle.emoji}</span>
                        )}
                      </div>
                    );

                    if (bottle) {
                      return (
                        <Link key={`${cocktail.id}-${ingredient.name}`} href={`/bottle/${bottle.id}`}>
                          {inner}
                        </Link>
                      );
                    }

                    return <div key={`${cocktail.id}-${ingredient.name}`}>{inner}</div>;
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            {t("prev")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-lg"
            disabled={index === cocktails.length - 1}
            onClick={() => goTo(index + 1)}
          >
            {t("next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
