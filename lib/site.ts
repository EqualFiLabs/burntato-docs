// Canonical production domain. Drives absolute URLs in sitemap/OpenGraph output,
// so it must match the host actually serving the site.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docs.burntato.com";

export const SITE_NAME = "Burntato Docs";

export const SITE_DESCRIPTION =
  "Learn Burntato's onchain Hot Potato game, POTATO emissions, Recovery Market, Operator rewards, canonical market, and protocol interfaces.";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://burntato.com";

export const PROTOCOL_SOURCE_URL =
  process.env.NEXT_PUBLIC_PROTOCOL_URL ?? "https://github.com/EqualFiLabs/burntato";

export const DOCS_SOURCE_URL =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "https://github.com/EqualFiLabs/burntato-docs";
