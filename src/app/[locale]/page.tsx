import { getBottles } from "@/lib/bottles";
import { getCocktailCounts } from "@/lib/cocktails";
import { HomePageClient } from "@/components/home-page-client";

export default async function HomePage() {
  const bottles = await getBottles();
  const cocktailCounts = getCocktailCounts();
  return <HomePageClient bottles={bottles} cocktailCounts={cocktailCounts} />;
}
