import { ValidationError } from "@/lib/errors";

const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^169\.254\./,
  /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^192\.0\.0\./,
  /^198\.1[89]\./,
  /^localhost$/i,
  /\.localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^::$/,
  /^::1$/,
  /^\[?::1\]?$/,
  /^f[cd][0-9a-f]{2}:/i,
  /^fe80:/i,
  /^ff[0-9a-f]{2}:/i,
  /^::ffff:/i,
];

export function validateUrl(url: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new ValidationError("Invalid URL");
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new ValidationError("Only HTTP/HTTPS URLs are allowed");
  }

  const hostname = parsed.hostname.replace(/^\[|]$/g, "");
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      throw new ValidationError("Private/internal URLs are not allowed");
    }
  }

  return parsed;
}

export function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some((p) => p.test(ip));
}

export function containsPrivateIP(addresses: { address: string }[]): boolean {
  return addresses.some((a) => isPrivateIP(a.address));
}
