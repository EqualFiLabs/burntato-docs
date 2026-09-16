import type { ReactNode } from "react";

import Link from "next/link";

import { BurntatoMark } from "@/components/burntato-mark";
import { SearchDocs } from "@/components/search-docs";
import { ThemeToggle } from "@/components/theme-toggle";
import { APP_URL, DOCS_SOURCE_URL, PROTOCOL_SOURCE_URL } from "@/lib/site";

export function SiteHeader({ leading }: { leading?: ReactNode }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        {leading}

        <Link className="brand" href="/">
          <BurntatoMark />
          <span className="brand-name">
            <strong>Burn</strong>tato <span>/ docs</span>
          </span>
        </Link>

        <SearchDocs />

        <nav className="top-links" aria-label="Site">
          <Link href="/docs/start/how-to-play">Play</Link>
          <Link href="/docs/recovery/overview">Recovery</Link>
          <Link href="/docs/operators/overview">Operators</Link>
          <Link href="/docs/build/integration">Builders</Link>
          <a href={PROTOCOL_SOURCE_URL} target="_blank" rel="noreferrer">
            Protocol ↗
          </a>
          <a href={DOCS_SOURCE_URL} target="_blank" rel="noreferrer">
            Edit docs ↗
          </a>
        </nav>
        <ThemeToggle />
        <a className="cta" href={APP_URL} target="_blank" rel="noreferrer">
          Open app ↗
        </a>
      </div>
    </header>
  );
}
