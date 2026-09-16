# Burntato Docs

The public documentation site for [Burntato](https://github.com/EqualFiLabs/burntato). It starts with a player-friendly explanation of the game, then covers POTATO emissions, Recovery, permanent Uniswap v4 liquidity, buybacks, Statics Operator rewards, protocol architecture, integration, and deployment verification.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run check:source
npm test
npm run verify
```

`check:source` compares documented assumptions and the published Robinhood testnet manifest against a sibling Burntato checkout at `../burntato/burntato`. Set `BURNTATO_PATH` to use another checkout. CI checks against the current `EqualFiLabs/burntato` `main` branch.

The production build is a static export in `out/`. Its postbuild step adds Pagefind search plus `llms.txt`, `llms-small.txt`, `llms-full.txt`, and clean Markdown routes for agent-readable documentation.

## Content

Pages live in `content/docs` and use frontmatter for navigation metadata. Add every new page ID to `NAVIGATION_GROUPS` in `lib/docs.ts`, then run the link and production-build checks.
