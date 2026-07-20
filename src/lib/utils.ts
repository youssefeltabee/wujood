export function cn(...classes: (string | boolean | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(" ");
}

const PRIVATE_RANGES = [
  /^127\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./,
  /^::1$/, /^fc00:/, /^fe80:/, /^0\.0\.0\.0$/,
];

export function isPrivateIP(ip: string): boolean {
  return PRIVATE_RANGES.some((r) => r.test(ip));
}
