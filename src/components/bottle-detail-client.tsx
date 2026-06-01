"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Heart, MapPin, Minus, Plus, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { openWhatsAppShare } from "@/lib/share-whatsapp";
import type { Bottle } from "@/lib/types";
import { formatPrice as formatInr } from "@/lib/types";

type BottleDetailClientProps = {
  bottle: Bottle;
  imageSrc?: string | null;
};

function BottleHeroVisual({
  src,
  emoji,
  name,
  reduceMotion,
  className,
}: {
  src?: string | null;
  emoji: string;
  name: string;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const float = reduceMotion
    ? undefined
    : { y: [0, -6, 0] as [number, number, number] };
  const floatTransition = reduceMotion
    ? undefined
    : { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const };

  if (!src || failed) {
    return (
      <motion.span
        className={cn("flex h-full scale-[1.15] items-center justify-center text-[5.5rem]", className)}
        animate={float}
        transition={floatTransition}
        aria-hidden
      >
        {emoji}
      </motion.span>
    );
  }

  return (
    <motion.div
      className={cn("relative h-full w-full", className)}
      animate={float}
      transition={floatTransition}
    >
      <Image
        src={src}
        alt={name}
        fill
        priority
        sizes="224px"
        className="object-contain object-center scale-[1.15]"
        onError={() => setFailed(true)}
      />
    </motion.div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function HeroIconButton({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-canvas/90 shadow-sm ring-1 ring-hairline transition-colors active:scale-95",
        active && "text-primary",
      )}
    >
      {children}
    </button>
  );
}

export function BottleDetailClient({ bottle, imageSrc }: BottleDetailClientProps) {
  const t = useTranslations("detail");
  const tc = useTranslations("categories");
  const tf = useTranslations("filters");
  const ta = useTranslations("app");
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [selectedVolume, setSelectedVolume] = useState(bottle.volumes[0]?.ml ?? 750);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [friends, setFriends] = useState(2);
  const [pageLink, setPageLink] = useState("");

  useEffect(() => {
    setPageLink(window.location.href);
  }, []);

  const volume = bottle.volumes.find((item) => item.ml === selectedVolume) ?? bottle.volumes[0];
  const total = (volume?.price ?? bottle.price_750ml) * quantity;
  const perPerson = useMemo(
    () => Math.ceil(total / Math.max(friends, 1)),
    [total, friends],
  );

  const previewMessage = useMemo(
    () =>
      t("share_whatsapp_message", {
        name: bottle.name,
        volume: selectedVolume,
        total: formatInr(total),
        friends,
        each: formatInr(perPerson),
        link: pageLink,
      }),
    [t, bottle.name, selectedVolume, total, friends, perPerson, pageLink],
  );

  function openStoreFinder() {
    window.open(
      "https://www.google.com/maps/search/bevco+ksbc+near+me",
      "_blank",
      "noopener,noreferrer",
    );
  }

  function shareOnWhatsApp() {
    openWhatsAppShare(previewMessage);
  }

  const stats = [
    {
      label: t("stat_abv"),
      value: t("vol", { abv: bottle.abv_value }),
    },
    {
      label: t("stat_score"),
      value: `${bottle.score}`,
    },
    {
      label: t("stat_origin"),
      value: tf(`origin_${bottle.origin}`),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-surface-soft">
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-soft">
        <div className="bg-canvas pb-2">
          <div className="flex items-center justify-between px-5 pt-3">
            <button
              type="button"
              aria-label={t("back")}
              onClick={() => router.back()}
              className="flex size-10 items-center justify-center rounded-full bg-canvas/90 shadow-sm ring-1 ring-hairline transition-colors active:scale-95"
            >
              <ChevronLeft className="size-5" strokeWidth={2} />
            </button>
            <div className="flex items-center gap-2">
              <HeroIconButton
                label={t("save_label")}
                active={liked}
                onClick={() => setLiked((value) => !value)}
              >
                <Heart className={cn("size-[18px]", liked && "fill-primary")} strokeWidth={2} />
              </HeroIconButton>
              <HeroIconButton
                label={t("share_to_friends")}
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="size-[18px]" strokeWidth={2} />
              </HeroIconButton>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full justify-center px-5"
          >
            <div className="relative h-64 w-56 overflow-hidden">
              <BottleHeroVisual
                src={imageSrc}
                emoji={bottle.emoji}
                name={bottle.name}
                reduceMotion={reduceMotion}
              />
            </div>
          </motion.div>
        </div>

        <div className="relative -mt-5 rounded-t-3xl bg-surface-soft px-5 pt-7 pb-6">
          <div className="grid grid-cols-3 gap-2.5 pb-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "rounded-[8px] px-2 py-3.5 text-center",
                  index === 1
                    ? "bg-canvas ring-1 ring-hairline"
                    : "border border-hairline bg-canvas/80",
                )}
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-1.5 text-xs font-bold leading-tight text-ink">{stat.value}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">{tc(bottle.type)}</p>
            <h1 className="font-display mt-1 text-3xl font-bold leading-tight tracking-tight text-ink">
              {bottle.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("by", { brand: bottle.brand })}
            </p>
          </div>

          <div className="mt-7">
            <p className="mb-3 text-sm font-semibold text-ink">{t("select_volume")}</p>
            <div className="flex flex-wrap gap-3">
              {bottle.volumes.map((item) => {
                const active = selectedVolume === item.ml;
                return (
                  <button
                    key={item.ml}
                    type="button"
                    onClick={() => setSelectedVolume(item.ml)}
                    className={cn(
                      "flex size-14 flex-col items-center justify-center rounded-full text-xs font-bold transition-all",
                      active
                        ? "bg-foreground text-background shadow-lg"
                        : "bg-card text-foreground ring-1 ring-border",
                    )}
                  >
                    <span>{item.ml}</span>
                    <span className="text-[10px] font-normal opacity-70">ml</span>
                  </button>
                );
              })}
            </div>
          </div>

          {bottle.taste.length > 0 ? (
            <div className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("taste_profile")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {bottle.taste.slice(0, 4).map((note) => (
                  <span
                    key={note}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-body-text"
                  >
                    {tf(`taste_${note}`)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs text-muted-foreground">{t("items_label")}</p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-secondary p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-6 text-center font-bold tabular-nums">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setQuantity((value) => value + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{ta("price_note")}</p>
              <p className="font-display text-4xl font-semibold tracking-tight text-ink">
                {formatInr(total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-surface-soft px-5 pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-xl bg-canvas text-sm font-medium"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="size-4" />
            {t("share_to_friends")}
          </Button>
          <Button
            type="button"
            className="h-12 w-full rounded-xl text-sm font-medium"
            onClick={openStoreFinder}
          >
            <MapPin className="size-4" />
            {t("find_store_near_me")}
          </Button>
        </div>
      </div>

      <Sheet open={shareOpen} onOpenChange={setShareOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[88vh] flex-col gap-0 rounded-t-2xl px-0 pb-0"
        >
          <SheetHeader className="shrink-0 border-b px-5 pb-4">
            <SheetTitle>{t("share_title")}</SheetTitle>
            <SheetDescription>{t("share_subtitle")}</SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <div className="rounded-xl border border-hairline bg-surface-soft p-4">
              <p className="font-display text-lg font-bold text-ink">{bottle.name}</p>
              <p className="mt-1 text-sm text-body-text">
                {selectedVolume} ml × {quantity} · {formatInr(total)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-body-text">{t("share_people_label")}</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary p-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setFriends((value) => Math.max(2, value - 1))}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="min-w-6 text-center font-bold">{friends}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full"
                  onClick={() => setFriends((value) => value + 1)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-text-muted">{t("share_each_pays")}</p>
              <p className="font-display mt-1 text-3xl font-bold text-ink">
                {formatInr(perPerson)}
              </p>
            </div>

            <div className="rounded-xl border border-hairline bg-muted/40 p-4 text-sm leading-relaxed text-body-text">
              <p className="whitespace-pre-line">{previewMessage}</p>
            </div>
          </div>

          <div className="shrink-0 border-t bg-background px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
            <Button
              type="button"
              className="h-12 w-full gap-2 rounded-xl bg-[#25D366] text-base font-semibold text-white hover:bg-[#1fb355]"
              onClick={shareOnWhatsApp}
            >
              <WhatsAppIcon className="size-5" />
              {t("share_on_whatsapp")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
