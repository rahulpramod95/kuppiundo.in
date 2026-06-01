"use client";

import { usePathname } from "@/i18n/navigation";
import { SiteHeader } from "@/components/site-header";

/** Show the global Kuppiundo nav only on the home page. */
export function ConditionalSiteHeader() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <SiteHeader />;
}
