// Generates the agent-facing artifacts into the static export:
//   out/llms.txt       — llmstxt.org index with a key-facts preamble
//   out/llms-small.txt — condensed corpus (orientation + core pages)
//   out/llms-full.txt  — full clean concatenated corpus
//
// Reads clean markdown pre-rendered by the /raw/docs route handler during
// `next build`.
// Runs in postbuild (after next build + pagefind).

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.burntato.com";
const SITE_NAME = "Burntato Docs";
const SITE_DESCRIPTION =
  "Documentation for Burntato — a fully onchain Hot Potato game with holder-time POTATO emissions, forward Recovery commitments, permanently locked Uniswap v4 liquidity, Treasury buybacks, and Statics Operator rewards.";

const ROOT = process.cwd();
const contentDir = path.join(ROOT, "content", "docs");
const outDir = path.join(ROOT, "out");
const rawDir = path.join(outDir, "raw", "docs");

// Slugs included in the condensed small corpus (orientation-critical only).
const SMALL_SLUGS = new Set([
  "introduction",
  "start/how-to-play",
  "start/money-flows",
  "glossary",
  "game/holder-emissions",
  "recovery/overview",
  "potato/token",
  "protocol/architecture",
  "build/integration",
  "reference/launch-parameters",
]);

function findMdxFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return findMdxFiles(entryPath);
      }
      return entry.isFile() && entry.name.endsWith(".mdx") ? [entryPath] : [];
    })
    .sort();
}

function readCleanBody(slug) {
  const file = path.join(rawDir, `${slug}.md`);
  if (!fs.existsSync(file)) {
    return null;
  }
  return fs.readFileSync(file, "utf8").trim();
}

if (!fs.existsSync(outDir)) {
  console.error("generate-agent-output: out/ not found — run next build first.");
  process.exit(1);
}

const pages = findMdxFiles(contentDir)
  .map((filePath) => {
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    const slug = String(data.slug);
    return {
      slug,
      title: String(data.title),
      description: String(data.description),
      order: Number(data.order),
      body: readCleanBody(slug),
    };
  })
  .sort((left, right) => left.order - right.order);

const facts = [
  `Game: fully onchain Hot Potato behind an EIP-2535 Diamond`,
  `Mainnet launch: 0.01 ETH starting Grab; 10% price step; 10,000 POTATO round emission`,
  `Grab two onward: 25% current Winner, 2% next Winner, 40% Recovery, 5% Treasury, 13% buybacks, 15% Statics Operators`,
  `First Grab: 100% funds the next round's Winner pot`,
  `Canonical market: native ETH/POTATO Uniswap v4 pool with 56 permanently locked positions`,
  `Recovery settlement: 90% of committed POTATO is burned and 10% is credited to Treasury`,
  `Operator rewards: 15% of Grab revenue plus 40% of Burntato's 1% swap fee`,
];

// ---- llms.txt (index) ----
const index = [
  `# ${SITE_NAME}`,
  "",
  `> ${SITE_DESCRIPTION}`,
  "",
  "## Key facts",
  "",
  ...facts.map((f) => `- ${f}`),
  "",
  "## Context tiers",
  "",
  `- Condensed: ${SITE_URL}/llms-small.txt`,
  `- Full corpus: ${SITE_URL}/llms-full.txt`,
  "",
  "## Docs (clean markdown)",
  "",
  ...pages.map((p) => `- [${p.title}](${SITE_URL}/raw/docs/${p.slug}.md): ${p.description}`),
  "",
].join("\n");
fs.writeFileSync(path.join(outDir, "llms.txt"), index);

// ---- corpus builder ----
function pageBlock(p) {
  return [`# ${p.title}`, "", `URL: ${SITE_URL}/raw/docs/${p.slug}.md`, "", `> ${p.description}`, "", p.body ?? "(body unavailable)"].join(
    "\n",
  );
}

// ---- llms-full.txt ----
const full = pages.map(pageBlock).join("\n\n---\n\n");
fs.writeFileSync(path.join(outDir, "llms-full.txt"), `${full}\n`);

// ---- llms-small.txt ----
const smallPages = pages.filter((p) => SMALL_SLUGS.has(p.slug));
const smallHeader = [
  `# ${SITE_NAME} — condensed context`,
  "",
  `> ${SITE_DESCRIPTION}`,
  "",
  "## Key facts",
  "",
  ...facts.map((f) => `- ${f}`),
  "",
  `This is the orientation subset. Load the full corpus at ${SITE_URL}/llms-full.txt.`,
  "",
  "---",
  "",
].join("\n");
const small = smallPages.map(pageBlock).join("\n\n---\n\n");
fs.writeFileSync(path.join(outDir, "llms-small.txt"), `${smallHeader}${small}\n`);

const missing = pages.filter((p) => p.body === null).map((p) => p.slug);
console.log(
  `generate-agent-output: ${pages.length} pages | llms.txt, llms-small.txt (${smallPages.length}), llms-full.txt${
    missing.length ? ` | missing clean bodies: ${missing.join(", ")}` : ""
  }`,
);
