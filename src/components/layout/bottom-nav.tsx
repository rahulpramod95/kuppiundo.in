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
        "flex min-w-[4.5rem] flex-col items-center gap-0.5 pt-2.5 pb-1 transition-colors",
        active ? "text-primary" : "text-muted-soft",
      )}
    >
      <span className="[&>svg]:size-[21px]">{icon}</span>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
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
    <nav className="sticky bottom-0 z-40 border-t border-hairline bg-canvas px-2 pb-4">
      <div className="flex items-end justify-evenly">
        <NavItem href="/" icon={<Home />} label={t("home")} active={isHome} />

        <Link
          href="/find"
          className="flex flex-col items-center gap-0.5"
          aria-label={t("find")}
        >
          <span
            className={cn(
              "-mt-5 flex size-[50px] items-center justify-center rounded-full border-4 border-canvas bg-primary text-primary-foreground shadow-[rgba(0,0,0,0.04)_0_2px_8px_0] transition-transform active:scale-95",
              isFind && "ring-2 ring-primary ring-offset-2 ring-offset-canvas",
            )}
          >
            <Wine className="size-[22px]" strokeWidth={2} />
          </span>
          <span
            className={cn(
              "text-[10px] font-medium tracking-wide",
              isFind ? "text-primary" : "text-muted-soft",
            )}
          >
            {t("find")}
          </span>
        </Link>

        <NavItem
          href="/browse"
          icon={<LayoutGrid />}
          label={t("browse")}
          active={isBrowse}
        />
      </div>
    </nav>
  );
}
