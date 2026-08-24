// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createHash } from "crypto";

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

vi.hoisted(() => {
  process.env.JWT_SECRET = "test-secret-value-that-is-at-least-32-chars-long";
});

type RefreshRow = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
};

const { state } = vi.hoisted(() => {
  const rows: RefreshRow[] = [];
  const emails = new Map<string, string>();
  let seq = 0;

  return {
    state: {
      rows,
      addUser(userId: string, email: string) {
        emails.set(userId, email);
      },
      reset() {
        rows.length = 0;
        emails.clear();
        seq = 0;
      },
      delegate: {
        create({ data }: { data: Omit<RefreshRow, "id" | "createdAt" | "revokedAt"> }) {
          const row: RefreshRow = { id: `rt_${++seq}`, createdAt: new Date(), revokedAt: null, ...data };
          rows.push(row);
          return row;
        },
        findUnique({ where }: { where: { token: string } }) {
          const row = rows.find((r) => r.token === where.token);
          if (!row) return null;
          return { ...row, user: { email: emails.get(row.userId) ?? "" } };
        },
        updateMany({
          where,
          data,
        }: {
          where: { token?: string; userId?: string; revokedAt?: null; expiresAt?: { gte: Date } };
          data: { revokedAt: Date };
        }) {
          let count = 0;
          for (const row of rows) {
            if (where.token !== undefined && row.token !== where.token) continue;
            if (where.userId !== undefined && row.userId !== where.userId) continue;
            if (where.revokedAt === null && row.revokedAt !== null) continue;
            if (where.expiresAt && row.expiresAt < where.expiresAt.gte) continue;
            row.revokedAt = data.revokedAt;
            count++;
          }
          return { count };
        },
      },
    },
  };
});

vi.mock("@/lib/db", () => ({ prisma: { refreshToken: state.delegate } }));

import { createSession, rotateRefreshToken, revokeRefreshToken, revokeAllUserSessions } from "../auth.session";

function seedActiveSession(userId = "user_1", email = "boss@wujood.app") {
  state.addUser(userId, email);
  return createSession(userId, email);
}

describe("refresh token storage", () => {
  beforeEach(() => state.reset());

  it("stores only the sha256 hash of the refresh token at rest", async () => {
    const { refreshToken } = await seedActiveSession();

    expect(state.rows).toHaveLength(1);
    expect(state.rows[0].token).not.toBe(refreshToken);
    expect(state.rows[0].token).toBe(sha256(refreshToken));
  });

  it("rotates a valid token and stores the new one hashed", async () => {
    const { refreshToken: oldRaw } = await seedActiveSession();

    const result = await rotateRefreshToken(oldRaw);

    expect(result).not.toBeNull();
    expect(result!.refreshToken).not.toBe(oldRaw);
    expect(result!.accessToken).toBeTruthy();

    const storedTokens = state.rows.map((r) => r.token);
    expect(storedTokens).toContain(sha256(oldRaw));
    expect(storedTokens).toContain(sha256(result!.refreshToken));

    const oldRow = state.rows.find((r) => r.token === sha256(oldRaw))!;
    expect(oldRow.revokedAt).not.toBeNull();

    const newRow = state.rows.find((r) => r.token === sha256(result!.refreshToken))!;
    expect(newRow.revokedAt).toBeNull();
  });

  it("rejects an unknown token without revoking anything", async () => {
    await seedActiveSession();
    const before = state.rows.map((r) => r.revokedAt);

    const result = await rotateRefreshToken("never-issued-raw-token");

    expect(result).toBeNull();
    expect(state.rows.map((r) => r.revokedAt)).toEqual(before);
  });

  it("rejects an expired token", async () => {
    const { refreshToken } = await seedActiveSession();
    state.rows[0].expiresAt = new Date(Date.now() - 1000);

    const result = await rotateRefreshToken(refreshToken);

    expect(result).toBeNull();
  });
});

describe("reuse detection", () => {
  beforeEach(() => state.reset());

  it("revokes ALL user sessions when a already-revoked token is presented", async () => {
    const first = await seedActiveSession("user_1", "boss@wujood.app");
    const second = await seedActiveSession("user_1", "boss@wujood.app");

    await rotateRefreshToken(first.refreshToken);

    const reuse = await rotateRefreshToken(first.refreshToken);
    expect(reuse).toBeNull();

    for (const row of state.rows) {
      expect(row.revokedAt, `row ${row.id} must be revoked`).not.toBeNull();
    }

    void second;
  });

  it("does not cascade revocation when a live token rotates normally", async () => {
    const first = await seedActiveSession("user_1", "boss@wujood.app");
    await seedActiveSession("user_1", "boss@wujood.app");

    await rotateRefreshToken(first.refreshToken);

    const others = state.rows.filter((r) => r.token !== sha256(first.refreshToken));
    expect(others.some((r) => r.revokedAt === null)).toBe(true);
  });

  it("keeps other users unaffected by one user's reuse attack", async () => {
    const attacker = await seedActiveSession("attacker", "bad@wujood.app");
    const victim = await seedActiveSession("victim", "good@wujood.app");

    await rotateRefreshToken(attacker.refreshToken);
    await rotateRefreshToken(attacker.refreshToken);

    const victimRows = state.rows.filter((r) => r.userId === "victim");
    expect(victimRows.every((r) => r.revokedAt === null)).toBe(true);
    void victim;
  });
});

describe("revocation lookup hashing", () => {
  beforeEach(() => state.reset());

  it("revokeRefreshToken finds the row via its hash and revokes it", async () => {
    const { refreshToken } = await seedActiveSession();

    await revokeRefreshToken(refreshToken);

    expect(state.rows[0].revokedAt).not.toBeNull();
  });

  it("revokeAllUserSessions revokes every live session for the user", async () => {
    await seedActiveSession("user_1", "a@wujood.app");
    await seedActiveSession("user_1", "a@wujood.app");
    await seedActiveSession("user_2", "b@wujood.app");

    await revokeAllUserSessions("user_1");

    const user1 = state.rows.filter((r) => r.userId === "user_1");
    const user2 = state.rows.filter((r) => r.userId === "user_2");
    expect(user1.every((r) => r.revokedAt !== null)).toBe(true);
    expect(user2.every((r) => r.revokedAt === null)).toBe(true);
  });
});
