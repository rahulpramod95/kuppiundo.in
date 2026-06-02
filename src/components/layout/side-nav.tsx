"use client";

import { useEffect, useState } from "react";
import { Home, LayoutGrid, Wine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { loadTasteProfile } from "@/lib/taste-profile";
import { cn } from "@/lib/utils";

function SideNavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "interactive-focus flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary/8 text-primary"
          : "text-body-text hover:bg-surface-soft",
      )}
    >
      <span className="[&>svg]:size-[20px]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export function SideNav({ className }: { className?: string }) {
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

  const isHome = pathname === "/";
  const isFind = pathname === "/find" || pathname.startsWith("/find/");
  const isBrowse = pathname === "/browse" || pathname.startsWith("/browse/");

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:w-56 lg:shrink-0 lg:flex-col lg:border-r lg:border-hairline lg:bg-canvas",
        "sticky top-0 h-dvh",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {/* Wordmark */}
        <div className="mb-6 flex items-center gap-2.5 px-3 pt-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-extrabold text-primary-foreground">K</span>
          </div>
          <span className="text-[15px] font-bold leading-none">
            <span className="text-ink">{t("nav_wordmark_prefix")}</span>
            <span className="text-primary">{t("nav_wordmark_suffix")}</span>
          </span>
        </div>

        {/* Nav links */}
        <SideNavItem
          href="/"
          icon={<Home strokeWidth={2} />}
          label={tn("home")}
          active={isHome}
        />
        <SideNavItem
          href="/find"
          icon={<Wine strokeWidth={2} />}
          label={tn("find")}
          active={isFind}
        />
        <SideNavItem
          href="/browse"
          icon={<LayoutGrid strokeWidth={2} />}
          label={tn("browse")}
          active={isBrowse}
        />

        {hasProfile && (
          <div className="mt-2 border-t border-hairline pt-2">
            <Link
              href="/find"
              className="interactive-focus flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body-text hover:bg-surface-soft"
            >
              <span className="relative flex size-5 items-center justify-center">
                <Wine className="size-[20px]" strokeWidth={2} />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive ring-1 ring-canvas" />
              </span>
              <span>{t("welcome_back_profile")}</span>
            </Link>
          </div>
        )}
      </div>

      {/* Language toggle */}
      <div className="border-t border-hairline p-4">
        <button
          type="button"
          onClick={toggleLang}
          aria-label={isMalayalam ? tn("lang_switch_to_en") : tn("lang_switch_to_ml")}
          className={cn(
            "interactive-focus flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            isMalayalam
              ? "border border-primary/30 bg-primary/5 text-primary"
              : "text-body-text hover:bg-surface-soft",
          )}
        >
          <span className="text-base leading-none">മ</span>
          <span>{isMalayalam ? "മലയാളം" : "English"}</span>
        </button>
      </div>
    </aside>
  );
}
