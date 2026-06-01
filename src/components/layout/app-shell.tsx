"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const immersive =
    pathname.startsWith("/bottle/") || pathname === "/find";

  return (
    <main
      className={cn(
        "mx-auto min-h-dvh w-full bg-background",
        immersive
          ? "max-w-none lg:my-0 lg:rounded-none lg:border-0 lg:shadow-none"
          : "app-shell max-w-md",
      )}
    >
      {children}
    </main>
  );
}
