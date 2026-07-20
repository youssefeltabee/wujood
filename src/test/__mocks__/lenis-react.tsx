import { type ReactNode } from "react";

// Stub for lenis/react — the dist file is missing from the installed package
export function Lenis({
  children,
  root,
  options,
}: {
  children: ReactNode;
  root?: boolean;
  options?: Record<string, unknown>;
}) {
  return <div data-lenis-root={root?.toString()}>{children}</div>;
}
