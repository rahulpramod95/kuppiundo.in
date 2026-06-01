import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans, Inter, Manjari } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { AppShell } from "@/components/layout/app-shell";
import { AgeGateProvider } from "@/components/age-gate-provider";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

const manjari = Manjari({
  subsets: ["malayalam"],
  weight: ["400", "700"],
  variable: "--font-malayalam",
  display: "swap",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("app");

  const footer = (
    <footer className="px-5 py-8 text-center">
      <p className="text-xs font-medium">{t("tagline")}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {t("price_updated")} · {t("available_kerala")}
      </p>
    </footer>
  );

  return (
    <html lang={locale}>
      <body
        className={cn(
          plusJakarta.variable,
          inter.variable,
          manjari.variable,
          locale === "ml" ? "font-malayalam" : "font-body",
          "min-h-screen antialiased",
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <AgeGateProvider>
            <AppShell>
              <AppChrome footer={footer}>{children}</AppChrome>
            </AppShell>
          </AgeGateProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
