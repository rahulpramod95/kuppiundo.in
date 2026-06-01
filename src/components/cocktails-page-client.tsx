"use client";

import { useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronRight } from "lucide-react";
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

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

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
  const progress = cocktails.length > 0 ? ((index + 1) / cocktails.length) * 100 : 0;

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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SecondaryPageHeader
        backHref="/"
        backLabel={t("back_home")}
        title={t(`label_${spiritType}`)}
        subtitle={tc(spiritType)}
      />

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                {t("recipe_of", { current: index + 1, total: cocktails.length })}
              </p>
              <p className="text-xs text-muted-soft">{t("swipe_hint")}</p>
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={cocktail.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="touch-pan-y space-y-5"
            >
              <div className="relative flex h-52 w-full items-center justify-center overflow-hidden rounded-xl bg-surface-soft">
                <span className="text-7xl drop-shadow-sm">{cocktail.emoji}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">{tc(spiritType)}</p>
                <h2 className="font-display mt-1 text-2xl font-bold leading-tight tracking-tight text-ink">
                  {cocktail.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-body-text">
                  {cocktail.description}
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("ingredients_title")}
                </p>
                <div className="space-y-2.5">
                  {cocktail.ingredients.map((ingredient) => {
                    const bottle = ingredient.bottleId
                      ? bottleMap.get(ingredient.bottleId)
                      : undefined;

                    const content = (
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-xl">
                          {ingredient.emoji}
                        </span>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-sm font-semibold text-ink">{ingredient.name}</p>
                          <p className="text-xs text-body-text">{ingredient.amount}</p>
                          {bottle ? (
                            <p className="mt-0.5 text-xs font-medium text-primary">
                              {t("available_kerala")}
                            </p>
                          ) : null}
                        </div>
                        {bottle ? (
                          <ChevronRight
                            className="size-4 shrink-0 text-muted-soft"
                            strokeWidth={2}
                            aria-hidden
                          />
                        ) : null}
                      </div>
                    );

                    if (bottle) {
                      return (
                        <Link
                          key={`${cocktail.id}-${ingredient.name}`}
                          href={`/bottle/${bottle.id}`}
                          className="block rounded-xl border border-hairline bg-card p-3.5 transition-colors active:scale-[0.99] hover:bg-surface-soft"
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={`${cocktail.id}-${ingredient.name}`}
                        className="rounded-xl border border-hairline bg-card p-3.5"
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="shrink-0 border-t border-hairline bg-canvas px-5 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1 rounded-xl text-sm font-medium"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            {t("prev")}
          </Button>
          <Button
            type="button"
            className={cn(
              "h-12 flex-1 rounded-xl text-sm font-medium",
              index === cocktails.length - 1 && "opacity-60",
            )}
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
