import type { HTMLAttributes } from "react";

export function BurntatoMark({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`burntato-mark ${className}`.trim()} aria-hidden="true" {...props}>
      B
    </span>
  );
}
