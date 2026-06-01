"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { FloatingNav } from "@/components/layout/floating-nav";
import { BottomNav } from "@/components/layout/bottom-nav";
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
  const hideBottomNav = isBottle || isFind;
  const immersiveScroll = isFind || isBottle;

  return (
    <div className="relative flex min-h-dvh flex-col">
      {isHome ? <FloatingNav /> : null}
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            "flex-1",
            immersiveScroll
              ? "flex min-h-0 flex-col overflow-hidden"
              : "overflow-y-auto",
            isHome ? "pt-[4.75rem]" : "pt-0",
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
