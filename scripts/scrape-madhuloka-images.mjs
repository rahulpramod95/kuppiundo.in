/**
 * Crawl Madhuloka shop pages and download product bottle images.
 * Config: scripts/madhuloka-scraper.config.json
 * Run: node scripts/scrape-madhuloka-images.mjs
 * Env: MADHULOKA_MAX_PAGES, MADHULOKA_SKIP_DOWNLOAD=1
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const config = JSON.parse(
  readFileSync(join(__dirname, "madhuloka-scraper.config.json"), "utf8"),
);

const {
  baseUrl,
  shopPath,
  outputDir,
  manifestPath,
  imageSize,
  pageDelayMs,
  downloadDelayMs,
  downloadConcurrency,
  userAgent,
} = config;

const MAX_PAGES = Number(process.env.MADHULOKA_MAX_PAGES ?? 0) || Infinity;
const SKIP_DOWNLOAD = process.env.MADHULOKA_SKIP_DOWNLOAD === "1";

const CARD_RE =
  /<form action="\/shop\/cart\/update"[\s\S]*?<\/form>/g;
const PLACEHOLDER_RE = /placeholder|img_plchr/i;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function productIdFromUrl(url) {
  const match = url.match(/-(\d+)(?:\?|$)/);
  return match ? match[1] : null;
}

function skuFromName(name) {
  const match = name.match(/\[?(M\d+)\]?/i);
  return match ? match[1].toUpperCase() : null;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": userAgent, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function parseShopPage(html) {
  const products = [];

  for (const match of html.matchAll(CARD_RE)) {
    const card = match[0];
    const nameMatch = card.match(
      /itemprop="name"[^>]*href="([^"]+)"[^>]*content="([^"]+)"/,
    );
    if (!nameMatch) continue;

    const [, shopUrl, name] = nameMatch;
    const templateId =
      card.match(/product\.template\/(\d+)/)?.[1] ??
      productIdFromUrl(shopUrl);
    const imgMatch = card.match(/<img[^>]+src="([^"]+)"/);
    const listingImage = imgMatch?.[1] ?? null;
    const price = card.match(/itemprop="price"[^>]*>([^<]+)/)?.[1]?.trim();
    const hasListingImage =
      listingImage && !PLACEHOLDER_RE.test(listingImage);

    products.push({
      name: name.trim(),
      shopUrl,
      templateId,
      sku: skuFromName(name) ?? skuFromName(shopUrl),
      price: price ? Number(price) : null,
      listingImage,
      hasListingImage,
    });
  }

  return products;
}

async function crawlProducts() {
  const byTemplateId = new Map();
  let page = 1;
  let emptyStreak = 0;

  while (page <= MAX_PAGES) {
    const path = page === 1 ? shopPath : `${shopPath}/page/${page}`;
    const url = `${baseUrl}${path}`;
    process.stdout.write(`Crawling page ${page}: ${url}\n`);

    let html;
    try {
      html = await fetchText(url);
    } catch (error) {
      process.stdout.write(`  stopped: ${error.message}\n`);
      break;
    }

    const pageProducts = parseShopPage(html);
    let added = 0;

    for (const product of pageProducts) {
      if (!product.templateId) continue;
      if (!byTemplateId.has(product.templateId)) {
        byTemplateId.set(product.templateId, product);
        added += 1;
      }
    }

    process.stdout.write(`  found ${pageProducts.length}, new ${added}\n`);

    if (added === 0) {
      emptyStreak += 1;
      if (emptyStreak >= 2) break;
    } else {
      emptyStreak = 0;
    }

    page += 1;
    await sleep(pageDelayMs);
  }

  return [...byTemplateId.values()];
}

function imageUrl(templateId) {
  return `${baseUrl}/web/image/product.template/${templateId}/${imageSize}`;
}

function extensionFromContentType(contentType, contentDisposition) {
  const filenameMatch = contentDisposition?.match(/filename="?([^";]+)"?/i);
  if (filenameMatch) {
    const ext = extname(filenameMatch[1]);
    if (ext) return ext;
  }
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) {
    return ".jpg";
  }
  if (contentType?.includes("png")) return ".png";
  return ".bin";
}

async function downloadImage(product, destDir) {
  const url = imageUrl(product.templateId);
  const res = await fetch(url, {
    headers: { "User-Agent": userAgent, Accept: "image/*" },
    redirect: "follow",
  });

  if (!res.ok) {
    return { ...product, imageUrl: url, status: "http_error", httpStatus: res.status };
  }

  const contentType = res.headers.get("content-type") ?? "";
  const contentDisposition = res.headers.get("content-disposition") ?? "";

  if (PLACEHOLDER_RE.test(contentDisposition)) {
    return { ...product, imageUrl: url, status: "placeholder" };
  }

  const ext = extensionFromContentType(contentType, contentDisposition);
  const baseName = product.sku
    ? slugify(product.sku)
    : slugify(`${product.templateId}-${product.name}`);
  const filename = `${baseName}${ext}`;
  const filePath = join(destDir, filename);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buffer);

  return {
    ...product,
    imageUrl: url,
    localPath: `/${outputDir.replace(/^public\//, "")}/${filename}`,
    filename,
    contentType,
    status: "downloaded",
  };
}

async function runPool(items, worker, concurrency) {
  const results = [];
  let index = 0;

  async function next() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
      if (downloadDelayMs > 0) await sleep(downloadDelayMs);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => next()),
  );
  return results;
}

async function main() {
  const destDir = join(ROOT, outputDir);
  mkdirSync(destDir, { recursive: true });

  const products = await crawlProducts();
  process.stdout.write(`Total unique products: ${products.length}\n`);

  let results;
  if (SKIP_DOWNLOAD) {
    results = products.map((product) => ({
      ...product,
      imageUrl: imageUrl(product.templateId),
      status: "crawl_only",
    }));
  } else {
    process.stdout.write(`Downloading images to ${destDir}\n`);
    results = await runPool(
      products,
      (product) => downloadImage(product, destDir),
      downloadConcurrency,
    );
  }

  const downloaded = results.filter((item) => item.status === "downloaded");
  const placeholders = results.filter((item) => item.status === "placeholder");
  const errors = results.filter((item) => item.status === "http_error");

  const manifest = {
    source: baseUrl,
    scrapedAt: new Date().toISOString(),
    stats: {
      products: results.length,
      downloaded: downloaded.length,
      placeholders: placeholders.length,
      errors: errors.length,
    },
    products: results.map(
      ({
        name,
        shopUrl,
        templateId,
        sku,
        price,
        imageUrl: imgUrl,
        localPath,
        filename,
        status,
      }) => ({
        name,
        shopUrl: `${baseUrl}${shopUrl}`,
        templateId,
        sku,
        price,
        imageUrl: imgUrl,
        localPath: localPath ?? null,
        filename: filename ?? null,
        status,
      }),
    ),
  };

  const manifestFile = join(ROOT, manifestPath);
  mkdirSync(dirname(manifestFile), { recursive: true });
  writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

  process.stdout.write(
    `Done. downloaded=${downloaded.length} placeholders=${placeholders.length} errors=${errors.length}\n`,
  );
  process.stdout.write(`Manifest: ${manifestFile}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
