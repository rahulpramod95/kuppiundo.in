"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { FloatingNav } from "@/components/layout/floating-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SideNav } from "@/components/layout/side-nav";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: ReactNode;
  footer: ReactNode;
};

export function AppChrome({ children, footer }: AppChromeProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isFind = pathname === "/find";
  const isBottle = pathname.startsWith("/bottle/");
  const isCocktails = pathname.startsWith("/cocktails/");
  const hideBottomNav = isBottle || isFind || isCocktails;

  // Immersive pages (find, bottle, cocktails) manage their own internal scroll
  // so they need the outer container to not scroll
  const immersiveScroll = isFind || isBottle || isCocktails;

  return (
    <div className={cn("flex", immersiveScroll ? "h-dvh overflow-hidden" : "min-h-dvh")}>
      <SideNav />

      <div className={cn("relative flex min-w-0 flex-1 flex-col overflow-x-hidden", immersiveScroll && "overflow-hidden")}>
        {/* Floating nav: mobile home only */}
        {isHome ? <FloatingNav /> : null}

        {/* Main content — window scroll (non-immersive) or internal scroll (immersive) */}
        <div
          className={cn(
            "flex-1",
            immersiveScroll
              ? "flex min-h-0 flex-col overflow-y-auto overscroll-contain"
              : cn(
                  // no overflow here — body/window scrolls naturally (fixes iOS tap/focus)
                  !hideBottomNav && "pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0",
                ),
            isHome ? "pt-[5.5rem] lg:pt-0" : "pt-0",
          )}
        >
          {children}
          {isHome ? footer : null}
        </div>

        {/* Mobile bottom nav — fixed so it doesn't interfere with window scroll */}
        {hideBottomNav ? null : <BottomNav />}
      </div>
    </div>
  );
}
