import { describe, it, expect, vi, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

vi.mock("@/lib/db", () => ({
  prisma: {
    website: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";
import { createWebsite } from "../website.service";

const findFirst = prisma.website.findFirst as ReturnType<typeof vi.fn>;
const create = prisma.website.create as ReturnType<typeof vi.fn>;

beforeEach(() => {
  findFirst.mockReset();
  create.mockReset();
});

describe("createWebsite slug logic", () => {
  it("slugifies the title into the domain", async () => {
    findFirst.mockResolvedValue(null);
    create.mockResolvedValue({ id: "w1", domain: "my-cool-site" });
    const website = await createWebsite("u1", { title: "My Cool Site!" });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ domain: "my-cool-site" }) }),
    );
    expect(website.domain).toBe("my-cool-site");
  });

  it("throws ConflictError when the domain is already taken", async () => {
    findFirst.mockResolvedValue({ id: "w0", domain: "taken" });
    await expect(createWebsite("u1", { title: "taken" })).rejects.toMatchObject({ statusCode: 409 });
    expect(create).not.toHaveBeenCalled();
  });

  it("maps a P2002 race to a conflict", async () => {
    findFirst.mockResolvedValue(null);
    create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError("unique", { code: "P2002", clientVersion: "6" }));
    await expect(createWebsite("u1", { title: "race" })).rejects.toMatchObject({ statusCode: 409 });
  });
});
