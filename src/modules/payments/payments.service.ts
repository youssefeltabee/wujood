import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { NotFoundError, ConflictError } from "@/lib/errors";

export async function getPayments(userId: string) {
  return prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

export async function getPayment(id: string, userId: string) {
  const payment = await prisma.payment.findFirst({ where: { id, userId } });
  if (!payment) throw new NotFoundError("Payment");
  return payment;
}

export async function createPayment(userId: string, data: { amount: number; currency: string; provider: string; providerRefNum: string; metadata?: Record<string, unknown> }) {
  return prisma.payment.create({ data: { ...data, userId, status: "pending", metadata: data.metadata as Prisma.InputJsonValue } });
}

export async function completePayment(id: string, callbackData?: Record<string, unknown>) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new NotFoundError("Payment");
  if (payment.status === "completed") throw new ConflictError("Payment already completed");

  return prisma.$transaction(async (tx) => {
    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    const markCompleted = {
      where: { id },
      data: {
        status: "completed",
        metadata: { ...meta, callback: callbackData } as Prisma.InputJsonValue,
      },
    };

    // ponytail: catalog purchases never touch subscriptions
    if (meta.catalogItemId) {
      return tx.payment.update(markCompleted);
    }

    const existingSub = await tx.subscription.findFirst({
      where: { userId: payment.userId, status: "active" },
    });

    if (existingSub) {
      const interval = existingSub.interval === "yearly" ? 365 : 30;
      const updatedSub = await tx.subscription.update({
        where: { id: existingSub.id },
        data: { expiresAt: new Date(Date.now() + interval * 86400000) },
      });
      return tx.payment.update({
        where: { id },
        data: { status: "completed", subscriptionId: updatedSub.id, metadata: { ...(payment.metadata as Record<string, unknown>), callback: callbackData } as Prisma.InputJsonValue },
      });
    }

    const newSub = await tx.subscription.create({
      data: { userId: payment.userId, tier: "kashif", priceEgp: 0, expiresAt: new Date(Date.now() + 30 * 86400000) },
    });
    return tx.payment.update({
      where: { id },
      data: { status: "completed", subscriptionId: newSub.id, metadata: { ...(payment.metadata as Record<string, unknown>), callback: callbackData } as Prisma.InputJsonValue },
    });
  });
}

export async function failPayment(id: string, callbackData?: Record<string, unknown>) {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) throw new NotFoundError("Payment");
  return prisma.payment.update({
    where: { id },
    data: { status: "failed", metadata: { ...(payment.metadata as Record<string, unknown>), callback: callbackData } as Prisma.InputJsonValue },
  });
}

export async function getCatalogItemForPayment(catalogItemId: string, userId: string) {
  const item = await prisma.catalogItem.findFirst({
    where: { id: catalogItemId, userId, isActive: true },
  });
  if (!item) throw new NotFoundError("Catalog item");
  return item;
}

export async function findPaymentByRef(providerRefNum: string) {
  return prisma.payment.findFirst({ where: { providerRefNum } });
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findFirst({ where: { userId } });
}
