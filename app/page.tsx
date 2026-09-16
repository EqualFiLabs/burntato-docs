import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
};

const gameSteps = [
  {
    number: "01",
    title: "Grab the potato",
    body: "Pay the exact current price to become the holder. Your Grab resets the countdown and raises the next price.",
    href: "/docs/start/how-to-play",
  },
  {
    number: "02",
    title: "Hold to earn POTATO",
    body: "Your emission opportunity vests with actual holder time. A fast pass earns less; a full hold earns the maximum opportunity.",
    href: "/docs/game/holder-emissions",
  },
  {
    number: "03",
    title: "Pass it—or win",
    body: "Another Grab replaces you and realizes your earned POTATO. If the timer expires while you hold it, you can settle and claim the Winner pot.",
    href: "/docs/game/rounds-and-grabs",
  },
  {
    number: "04",
    title: "Burn for Recovery",
    body: "Commit POTATO to the next round before it starts. Committed POTATO competes for that round's Recovery ETH and is consumed at settlement.",
    href: "/docs/recovery/overview",
  },
];

const paths = [
  {
    eyebrow: "Players",
    title: "Understand the game before your first Grab",
    body: "Learn the timer, prices, Winner pot, POTATO vesting, settlement, and claims without protocol jargon.",
    links: [
      { label: "How to play", href: "/docs/start/how-to-play" },
      { label: "Money flows", href: "/docs/start/money-flows" },
      { label: "Common questions", href: "/docs/start/faq" },
    ],
  },
  {
    eyebrow: "POTATO holders",
    title: "Choose between liquidity and Recovery",
    body: "POTATO can be sold into the canonical market, self-burned, or committed forward for a share of Recovery ETH.",
    links: [
      { label: "POTATO token", href: "/docs/potato/token" },
      { label: "Recovery Market", href: "/docs/recovery/overview" },
      { label: "Canonical market", href: "/docs/market/canonical-pool" },
    ],
  },
  {
    eyebrow: "Operators",
    title: "Share protocol revenue by activation weight",
    body: "Registered Statics Operators share configured purchase revenue and a governed portion of the existing swap fee.",
    links: [
      { label: "Operator rewards", href: "/docs/operators/overview" },
      { label: "Register and claim", href: "/docs/operators/register-and-claim" },
    ],
  },
  {
    eyebrow: "Builders",
    title: "Integrate one Diamond and its supporting contracts",
    body: "Read the EIP-2535 architecture, public interfaces, events, accounting boundaries, indexing model, and deployment manifests.",
    links: [
      { label: "Integration guide", href: "/docs/build/integration" },
      { label: "Architecture", href: "/docs/protocol/architecture" },
      { label: "Indexing", href: "/docs/build/indexing" },
    ],
  },
];

const protocolHighlights = [
  {
    title: "Round-snapshotted economics",
    body: "Governance can update future defaults without rewriting an active round or its already-open Recovery market.",
    href: "/docs/protocol/configuration",
  },
  {
    title: "Holder-time emissions",
    body: "Purchases move the game forward; only elapsed holder time consumes a round's POTATO emission budget.",
    href: "/docs/game/holder-emissions",
  },
  {
    title: "Forward Recovery",
    body: "POTATO commitments target the next round, while permissionless ETH sponsorship can target any future round.",
    href: "/docs/recovery/commitments-and-claims",
  },
  {
    title: "Permanent v4 liquidity",
    body: "The canonical POTATO/ETH pool launches across 56 fixed positions whose NFTs are permanently sent to the dead address.",
    href: "/docs/market/launch-curves",
  },
  {
    title: "Treasury buybacks",
    body: "A dedicated purchase share funds permissionless, rate-limited POTATO buybacks for Treasury inventory.",
    href: "/docs/market/buybacks",
  },
  {
    title: "Progressive administration",
    body: "A guardian can pause critical value flows; finalization disables Diamond cuts while leaving defined administration available.",
    href: "/docs/protocol/governance",
  },
];

export default function HomePage() {
  return (
    <div className="docs-app">
      <a className="skip-link" href="#landing-content">
        Skip to content
      </a>
      <SiteHeader />

      <main className="landing burntato-landing" id="landing-content">
        <section className="burntato-hero">
          <div className="burntato-hero-copy">
            <div className="hero-kicker">Fully onchain Hot Potato</div>
            <h1>Grab it. Hold it. Pass it—or win the pot.</h1>
            <p>
              Burntato is a timed ownership game. Every Grab pays into the round, resets the clock,
              raises the next price, and gives the new holder a chance to earn POTATO. The last holder
              after time runs out wins the ETH pot.
            </p>
            <div className="landing-actions">
              <Link className="cta" href="/docs/start/how-to-play">
                Learn the game
              </Link>
              <Link className="cta-secondary" href="/docs/start/money-flows">
                Follow the money
              </Link>
              <Link className="cta-secondary" href="/docs/build/integration">
                Build on Burntato
              </Link>
            </div>
          </div>
        </section>

        <section className="landing-section flow-section">
          <div className="section-heading">
            <span>One round, four moves</span>
            <h2>The game in plain English</h2>
            <p>You can understand the core loop before learning anything about Diamonds, hooks, or basis points.</p>
          </div>
          <div className="game-flow-grid">
            {gameSteps.map((step) => (
              <Link className="flow-card" href={step.href} key={step.number}>
                <span className="flow-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="landing-section">
          <div className="section-heading">
            <span>Choose your path</span>
            <h2>Start with what you want to do</h2>
          </div>
          <div className="card-grid persona-grid">
            {paths.map((path) => (
              <div className="landing-card persona-card" key={path.eyebrow}>
                <div className="card-eyebrow">{path.eyebrow}</div>
                <div className="landing-card-title">{path.title}</div>
                <p>{path.body}</p>
                <div className="persona-links">
                  {path.links.map((link) => (
                    <Link href={link.href} key={link.label}>
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section technical-section">
          <div className="section-heading">
            <span>Under the hood</span>
            <h2>Technical when you need it</h2>
            <p>Each topic is grounded in the current protocol source and links into the deeper reference.</p>
          </div>
          <div className="card-grid technical-grid">
            {protocolHighlights.map((item) => (
              <Link className="landing-card" href={item.href} key={item.title}>
                <div className="landing-card-title">{item.title}</div>
                <p>{item.body}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="docs-footer">
        <div className="docs-footer-inner">
          ©{" "}
          <a href="https://equalfi.org" target="_blank" rel="noreferrer">
            EqualFi Labs
          </a>
          . All rights reserved.
        </div>
      </footer>
    </div>
  );
}
