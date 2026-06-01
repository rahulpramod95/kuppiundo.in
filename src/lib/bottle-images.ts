import catalog from "@/data/madhuloka-catalog.json";

type CatalogProduct = {
  shopUrl: string;
  localPath: string | null;
  imageUrl: string;
  status: string;
};

/** Seed bottle id → Madhuloka URL slug when they differ. */
const SLUG_ALIASES: Record<string, string> = {
  "amrut-fusion": "amrut-fusion-single-malt",
  "hennessy-vs": "hennessy-vsop-cognac",
  "johnnie-walker-red": "jw-red-label",
  "teacher's-50": "teachers-50",
  "black-dog-triple-gold": "black-dog-8y",
  "jacob-creek": "jacobs-creek-classic-shiraz-cabernet",
  "sula-red": "sula-late-harvest-chenin",
  "bira-white": "bira-91-white-tin",
  "kingfisher-premium": "kf-premium-bottle",
  "mcdowells-no1": "mc-whisky",
  "beefeater": "beefeater-dry",
  "heineken": "heineken-beer",
  "jameson": "jameson-irish",
  "jack-daniels-single-malt": "jack-daniels",
};

function slugFromShopUrl(shopUrl: string): string | null {
  const match = shopUrl.match(/\/shop\/m\d+-(.+)-(\d+)/);
  return match?.[1] ?? null;
}

function buildSlugIndex(): Map<string, CatalogProduct> {
  const index = new Map<string, CatalogProduct>();

  for (const product of catalog.products as CatalogProduct[]) {
    const slug = slugFromShopUrl(product.shopUrl);
    if (!slug) continue;

    const existing = index.get(slug);
    const prefer =
      !existing ||
      (product.localPath && !existing.localPath) ||
      (product.status === "downloaded" && existing.status !== "downloaded");

    if (prefer) {
      index.set(slug, product);
    }
  }

  return index;
}

const slugIndex = buildSlugIndex();

function resolveProduct(bottleId: string): CatalogProduct | undefined {
  const slug = SLUG_ALIASES[bottleId] ?? bottleId;
  return slugIndex.get(slug);
}

/** Local scraped asset when available, else Madhuloka CDN. */
export function getBottleImageSrc(bottleId: string): string | null {
  const product = resolveProduct(bottleId);
  if (!product) return null;
  return product.localPath ?? product.imageUrl;
}

export function getBottleImageSrcMap(bottleIds: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const id of bottleIds) {
    const src = getBottleImageSrc(id);
    if (src) map[id] = src;
  }
  return map;
}
