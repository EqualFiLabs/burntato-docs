"use client";

import { useState } from "react";

const EXPLORER_URL = "https://explorer.testnet.chain.robinhood.com";

export function AddressChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const isAddress = value.length === 42;
  const valueKind = isAddress ? "address" : "hash";

  function copy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <span className="addr-chip">
      <code>{value}</code>
      <button type="button" onClick={copy} title="Copy" aria-label={`Copy ${valueKind}`}>
        {copied ? "✓" : "⧉"}
      </button>
      {isAddress ? (
        <a
          href={`${EXPLORER_URL}/address/${value}`}
          target="_blank"
          rel="noreferrer"
          title="View address on explorer"
          aria-label="View address on explorer"
        >
          ↗
        </a>
      ) : null}
    </span>
  );
}
