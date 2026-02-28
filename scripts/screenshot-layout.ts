import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const WIDTH = 1080;
const HEIGHT = 1440;

const layoutId = process.argv[2];
const url = process.argv[3] ?? "https://localhost:5173";

if (!layoutId) {
  console.error("Usage: pnpm screenshot <layout-id> [url]");
  console.error("  layout-id  Used as the output filename (e.g. sidebar-detail)");
  console.error(`  url        Page to capture (default: ${url})`);
  process.exit(1);
}

const outDir = resolve(__dirname, "../src/_starter/layouts/thumbnails");
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, `${layoutId}.png`);

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    ignoreHTTPSErrors: true,
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: outPath, fullPage: false });
  await browser.close();

  console.log(`Saved ${WIDTH}x${HEIGHT} screenshot to ${outPath}`);
}

capture().catch((err) => {
  console.error("Screenshot failed:", err);
  process.exit(1);
});
