"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CarFront, HeartPulse, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type StatutoryWarningOverlayProps = {
  open: boolean;
  onDismissed?: () => void;
};

const DISMISS_MS = 3000;
const FADE_MS = 300;

export function StatutoryWarningOverlay({
  open,
  onDismissed,
}: StatutoryWarningOverlayProps) {
  const t = useTranslations("statutory_warning");
  const onDismissedRef = useRef(onDismissed);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  onDismissedRef.current = onDismissed;

  useEffect(() => {
    if (!open) return;

    setMounted(true);
    const showFrame = requestAnimationFrame(() => setVisible(true));
    const hideTimer = window.setTimeout(() => setVisible(false), DISMISS_MS);
    const unmountTimer = window.setTimeout(() => {
      setMounted(false);
      onDismissedRef.current?.();
    }, DISMISS_MS + FADE_MS);

    return () => {
      cancelAnimationFrame(showFrame);
      window.clearTimeout(hideTimer);
      window.clearTimeout(unmountTimer);
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="statutory-warning-title"
      aria-describedby="statutory-warning-description"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center px-6 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" aria-hidden />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-2xl border border-white/10 bg-background p-6 text-center shadow-2xl">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
          <TriangleAlert className="size-7" strokeWidth={2.25} aria-hidden />
        </div>

        <h2
          id="statutory-warning-title"
          className="font-display text-2xl font-extrabold tracking-tight text-foreground"
        >
          {t("title")}
        </h2>

        <div
          id="statutory-warning-description"
          className="mt-5 flex w-full flex-col items-center gap-5"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <HeartPulse className="size-4.5" aria-hidden />
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("health_warning")}
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CarFront className="size-4.5" aria-hidden />
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("drive_warning")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
