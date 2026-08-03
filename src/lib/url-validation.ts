import { ValidationError } from "@/lib/errors";

const PRIVATE_IP_PATTERNS = [
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^127\./,
  /^0\./,
  /^localhost$/i,
  /\.local$/i,
  /\.internal$/i,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
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

  const hostname = parsed.hostname;
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
