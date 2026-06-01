import { notFound } from "next/navigation";
import { CocktailsPageClient } from "@/components/cocktails-page-client";
import { routing } from "@/i18n/routing";
import { getBottles } from "@/lib/bottles";
import { getCocktailsBySpirit } from "@/lib/cocktails";
import { SPIRIT_TYPES, type SpiritType } from "@/lib/types";

type PageProps = {
  params: Promise<{ locale: string; type: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SPIRIT_TYPES.map((type) => ({ locale, type })),
  );
}

export default async function CocktailsPage({ params }: PageProps) {
  const { type } = await params;

  if (!SPIRIT_TYPES.includes(type as SpiritType)) {
    notFound();
  }

  const spiritType = type as SpiritType;
  const [cocktails, bottles] = await Promise.all([
    getCocktailsBySpirit(spiritType),
    getBottles(),
  ]);

  return (
    <CocktailsPageClient
      spiritType={spiritType}
      cocktails={cocktails}
      bottles={bottles}
    />
  );
}
