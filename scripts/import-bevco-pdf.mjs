/**
 * Parse Bevco IMFL/Beer/Wine price list PDF → src/data/bevco-imfl.json
 * Run: node scripts/import-bevco-pdf.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PDFParse } from "pdf-parse";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const PDF_PATH =
  process.env.BEVCO_PDF ??
  "/Users/rahulpramod/Downloads/Kuppiundo.in/Pricing-Supply/PRICE-LIST___01-06-2026_Price-List-of-IMFLBEERWINE-for-Warehouses-and-FL-1-Shops-With-effect-from-11-05-2026-Tender-2026-27-Quoted-Items.pdf";

const VOLUME_SIZES =
  "180|200|250|300|330|350|375|500|650|700|750|1000|1500|2000|3000";
const VOLUME_RE = new RegExp(`^(${VOLUME_SIZES})$`);

const FL1_AFTER_TAX_RE =
  /([\d.]+)\s+([\d.]+)\s+([\d.]+)\t?\d+\s+[\d.]+\s*$/;

const FULL_ROW_RE = new RegExp(
  `^(\\d+[A-Z]?)\\s+(.+?)\\s+(${VOLUME_SIZES})\\s+(\\d+)\\s+([\\d.]+)\\s+`,
);

const CONT_ROW_RE = new RegExp(
  `^(\\d+[A-Z]?)\\s+(${VOLUME_SIZES})\\s+(\\d+)\\s+([\\d.]+)\\s+`,
);

const SKIP_LINE =
  /^(Product|-- \d|Code|Description|UOM|ml|Bot\/|Case|Proof|Landed|Cost|Excise|Duty|Import|Fee|Selling|Before Tax|Kerala|PRICE LIST|Cess|Amt\.|\* Note|IMFL Supplier|FMFL Supplier|Page \d)/i;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function inferType(name) {
  const u = name.toUpperCase();
  if (/\b(BEER|LAGER|ALE|STOUT|CIDER)\b/.test(u)) return "beer";
  if (/\b(WINE|PORT|SHERRY|SPARKLING|CHAMPAGNE|BRUT)\b/.test(u)) return "wine";
  if (/\b(BRANDY|COGNAC)\b/.test(u)) return "brandy";
  if (/\b(RUM)\b/.test(u)) return "rum";
  if (/\b(GIN)\b/.test(u)) return "gin";
  if (/\b(VODKA)\b/.test(u)) return "vodka";
  if (/\b(WHISKY|WHISKEY|SCOTCH|BOURBON|BLENDED)\b/.test(u)) return "whisky";
  return "whisky";
}

function inferEmoji(type) {
  const map = {
    whisky: "🥃",
    rum: "🍹",
    brandy: "🍸",
    gin: "🍸",
    vodka: "🧊",
    beer: "🍺",
    wine: "🍷",
  };
  return map[type] ?? "🥃";
}

/** Indian UP proof → approx ABV % */
function proofToAbv(proof) {
  if (!proof || proof <= 0) return 42.8;
  return Math.round(proof * 0.5714 * 10) / 10;
}

function abvRange(abv) {
  if (abv < 35) return "low";
  if (abv <= 45) return "medium";
  return "high";
}

function extractFl1Price(line) {
  const m = line.match(FL1_AFTER_TAX_RE);
  if (!m) return null;
  return Math.round(parseFloat(m[3]));
}

function parseRow(line) {
  const price = extractFl1Price(line);
  if (price == null) return null;

  const full = line.match(FULL_ROW_RE);
  if (full) {
    return {
      code: full[1],
      name: full[2].trim(),
      ml: parseInt(full[3], 10),
      proof: parseFloat(full[5]),
      price,
      isFull: true,
    };
  }

  const cont = line.match(CONT_ROW_RE);
  if (cont) {
    return {
      code: cont[1],
      ml: parseInt(cont[2], 10),
      proof: parseFloat(cont[4]),
      price,
      isFull: false,
    };
  }

  return null;
}

async function main() {
  console.log("Reading PDF:", PDF_PATH);
  const parser = new PDFParse({ data: readFileSync(PDF_PATH) });
  const result = await parser.getText();
  await parser.destroy();

  const lines = result.text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !SKIP_LINE.test(l));

  /** @type {Map<string, { name: string, type: string, proof: number, volumes: Map<number, number>, codes: string[] }>} */
  const products = new Map();
  let currentName = null;
  let currentType = "whisky";
  let currentProof = 75;

  for (const line of lines) {
    const row = parseRow(line);
    if (!row) continue;

    if (row.isFull) {
      currentName = row.name;
      currentType = inferType(row.name);
      currentProof = row.proof;
    }

    if (!currentName) continue;

    const key = currentName.toUpperCase();
    if (!products.has(key)) {
      products.set(key, {
        name: currentName,
        type: currentType,
        proof: row.proof ?? currentProof,
        volumes: new Map(),
        codes: [],
      });
    }

    const product = products.get(key);
    product.volumes.set(row.ml, row.price);
    product.codes.push(row.code);
    if (row.proof) product.proof = row.proof;
  }

  const updatedAt = "2026-06-01T00:00:00Z";
  const bottles = [];

  for (const [, p] of products) {
    const volumes = [...p.volumes.entries()]
      .map(([ml, price]) => ({ ml, price }))
      .sort((a, b) => a.ml - b.ml);

    if (volumes.length === 0) continue;

    const price750 =
      volumes.find((v) => v.ml === 750)?.price ??
      volumes.find((v) => v.ml === 500)?.price ??
      volumes[volumes.length - 1].price;

    const abv = proofToAbv(p.proof);

    bottles.push({
      id: slugify(p.name),
      name: p.name,
      brand: p.name.split(/\s+/).slice(0, 2).join(" "),
      type: p.type,
      origin: "imfl",
      abv_value: abv,
      abv_range: abvRange(abv),
      taste: [],
      notes: [],
      occasions: [],
      tags: ["bevco"],
      score: 50,
      emoji: inferEmoji(p.type),
      price_750ml: price750,
      volumes,
      available: true,
      updated_at: updatedAt,
      bevco_codes: [...new Set(p.codes)],
    });
  }

  bottles.sort((a, b) => a.name.localeCompare(b.name));

  const outPath = join(ROOT, "src/data/bevco-imfl.json");
  writeFileSync(outPath, JSON.stringify(bottles, null, 2) + "\n");

  const typeCounts = {};
  for (const b of bottles) {
    typeCounts[b.type] = (typeCounts[b.type] ?? 0) + 1;
  }

  console.log(`Parsed ${bottles.length} products → ${outPath}`);
  console.log("By type:", typeCounts);
  console.log(
    "Sample:",
    bottles
      .filter((b) => /ROYAL STAG|JACK DANIEL|SOUTHERN CHOICE/i.test(b.name))
      .slice(0, 5)
      .map((b) => ({ name: b.name, volumes: b.volumes })),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
