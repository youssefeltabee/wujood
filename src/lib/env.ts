import { z } from "zod";

const WEAK_SECRET_PATTERN = /(change|placeholder|your-secret|secret-key)/i;

const serverEnvSchema = z.object({
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters")
    .refine(
      (v) => !WEAK_SECRET_PATTERN.test(v),
      "JWT_SECRET must not contain placeholder words like 'change', 'placeholder', 'your-secret', 'secret-key'"
    ),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),
  TOKEN_ENCRYPTION_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Single source of truth for server env validation.
 * Edge-safe by design: no Prisma, no Node-only APIs — safe to import from middleware.
 */
export function getServerEnv(): ServerEnv {
  cached ??= (() => {
    const parsed = serverEnvSchema.safeParse({
      JWT_SECRET: process.env.JWT_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      TOKEN_ENCRYPTION_KEY: process.env.TOKEN_ENCRYPTION_KEY,
    });
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid server environment configuration — ${details}`);
    }
    return parsed.data;
  })();
  return cached;
}

/** JWT signing/verification secret as bytes for jose. Throws when missing or weak. */
export function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(getServerEnv().JWT_SECRET);
}

/** Social-module OAuth tokens are encrypted at rest; throws when the key is absent. */
export function requireTokenEncryptionKey(): string {
  const key = getServerEnv().TOKEN_ENCRYPTION_KEY;
  if (!key) throw new Error("TOKEN_ENCRYPTION_KEY is required when the social module is used");
  return key;
}
