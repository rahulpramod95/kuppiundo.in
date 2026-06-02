"use client";

import type { ReactNode } from "react";
import { Home, LayoutGrid, Wine } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "interactive-focus flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 transition-colors active:scale-[0.97]",
        active ? "text-primary" : "text-muted-soft",
      )}
    >
      <span className="[&>svg]:size-[22px]">{icon}</span>
      <span className="text-[11px] font-medium tracking-wide">{label}</span>
    </Link>
  );
}

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isFind = pathname === "/find" || pathname.startsWith("/find/");
  const isBrowse = pathname === "/browse" || pathname.startsWith("/browse/");

  return (
    <nav
      aria-label={t("main_label")}
      className="sticky bottom-0 z-40 border-t border-hairline bg-canvas/95 px-2 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <div className="flex items-end justify-evenly">
        <NavItem href="/" icon={<Home strokeWidth={2} />} label={t("home")} active={isHome} />

        <Link
          href="/find"
          className="interactive-focus flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl px-2 active:scale-[0.97]"
          aria-label={t("find")}
          aria-current={isFind ? "page" : undefined}
        >
          <span
            className={cn(
              "-mt-5 flex size-[52px] items-center justify-center rounded-full border-4 border-canvas bg-primary text-primary-foreground shadow-[var(--shadow-float)] transition-transform",
              isFind && "ring-2 ring-primary ring-offset-2 ring-offset-canvas",
            )}
          >
            <Wine className="size-[22px]" strokeWidth={2.25} />
          </span>
          <span
            className={cn(
              "text-[11px] font-medium tracking-wide",
              isFind ? "text-primary" : "text-muted-soft",
            )}
          >
            {t("find")}
          </span>
        </Link>

        <NavItem
          href="/browse"
          icon={<LayoutGrid strokeWidth={2} />}
          label={t("browse")}
          active={isBrowse}
        />
      </div>
    </nav>
  );
}
