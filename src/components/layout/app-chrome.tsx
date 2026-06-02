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
  const immersiveScroll = isFind || isBottle || isCocktails;

  return (
    <div className="flex min-h-dvh">
      <SideNav />

      <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
        {isHome ? <FloatingNav /> : null}

        <div
          className={cn(
            "flex-1",
            immersiveScroll
              ? "flex min-h-0 flex-col overflow-hidden"
              : cn(
                  "overflow-y-auto",
                  !hideBottomNav && "nav-scroll-padding lg:pb-0",
                ),
            isHome ? "pt-[5.5rem] lg:pt-0" : "pt-0",
          )}
        >
          {children}
          {isHome ? footer : null}
        </div>

        {hideBottomNav ? null : <BottomNav />}
      </div>
    </div>
  );
}
