"use client";

import { useEffect, useState } from "react";
import { Menu, Wine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { loadTasteProfile } from "@/lib/taste-profile";
import { cn } from "@/lib/utils";

function IconButton({
  className,
  children,
  onClick,
  "aria-label": ariaLabel,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  "aria-label": string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-strong transition-colors active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FloatingNav() {
  const t = useTranslations("app");
  const tn = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isMalayalam = locale === "ml";
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    setHasProfile(loadTasteProfile() !== null);
  }, [pathname]);

  function toggleLang() {
    router.replace(pathname, { locale: isMalayalam ? "en" : "ml" });
  }

  return (
    <div
      className="absolute top-3.5 right-3 left-3 z-50 flex items-center justify-between rounded-2xl border border-hairline bg-canvas/90 px-3.5 py-2.5 shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0] backdrop-blur-xl"
    >
      <IconButton aria-label={tn("menu_label")} onClick={() => console.log("menu")}>
        <Menu className="size-[18px] text-body-text" strokeWidth={2} />
      </IconButton>

      <div className="flex flex-1 items-center justify-center gap-2 px-2">
        <div className="flex size-[26px] shrink-0 items-center justify-center rounded-md bg-primary">
          <span className="font-display text-xs font-extrabold text-primary-foreground">K</span>
        </div>
        <span
          className={cn(
            "font-display text-[15px] font-bold leading-none",
            isMalayalam && "font-malayalam",
          )}
        >
          <span className="text-ink">{t("nav_wordmark_prefix")}</span>
          <span className="text-primary">{t("nav_wordmark_suffix")}</span>
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasProfile ? (
          <Link
            href="/find"
            aria-label={t("welcome_back_profile")}
            className="relative flex size-9 items-center justify-center rounded-lg border border-hairline bg-surface-strong transition-colors active:scale-95"
          >
            <Wine className="size-[18px] text-body-text" strokeWidth={2} />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive ring-2 ring-canvas" />
          </Link>
        ) : null}

        <IconButton
          aria-label={isMalayalam ? tn("lang_switch_to_en") : tn("lang_switch_to_ml")}
          onClick={toggleLang}
          className={cn(
            "border border-hairline",
            isMalayalam && "border-primary/40 bg-primary/5",
          )}
        >
          <span
            className={cn(
              "font-malayalam text-base font-medium leading-none",
              isMalayalam ? "text-primary" : "text-body-text",
            )}
          >
            മ
          </span>
        </IconButton>
      </div>
    </div>
  );
}
