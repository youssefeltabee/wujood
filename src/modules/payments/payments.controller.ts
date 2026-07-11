import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/modules/auth/auth.service";
import crypto from "crypto";

const FAWRY_MERCHANT_CODE = process.env.FAWRY_MERCHANT_CODE || "";
const FAWRY_SECURITY_KEY = process.env.FAWRY_SECURITY_KEY || "";
const FAWRY_BASE_URL = process.env.FAWRY_BASE_URL || "https://atfawry.fawrypay.com/api";

function generateFawrySignature(merchantRefNum: string, merchantCode: string, amount: number, securityKey: string) {
  const data = `${merchantRefNum}${merchantCode}${amount.toFixed(2)}${securityKey}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function createFawryCheckoutController(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { catalogItemId, quantity = 1 } = await req.json();
    if (!catalogItemId) return NextResponse.json({ error: "catalogItemId is required" }, { status: 400 });

    const item = await prisma.catalogItem.findFirst({
      where: { id: catalogItemId, userId: user.userId, isActive: true },
    });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const amount = Number(item.priceEgp) * quantity;
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid price" }, { status: 400 });

    const merchantRefNum = `wujood-${user.userId}-${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        userId: user.userId,
        amount,
        currency: "EGP",
        status: "pending",
        provider: "fawry",
        providerRefNum: merchantRefNum,
        metadata: { catalogItemId, quantity, itemName: item.name },
      },
    });

    if (!FAWRY_MERCHANT_CODE || !FAWRY_SECURITY_KEY) {
      return NextResponse.json({
        payment,
        checkoutUrl: null,
        mockMode: true,
        message: "Fawry not configured. Payment recorded as pending.",
      });
    }

    const signature = generateFawrySignature(merchantRefNum, FAWRY_MERCHANT_CODE, amount, FAWRY_SECURITY_KEY);

    const body = {
      merchantCode: FAWRY_MERCHANT_CODE,
      merchantRefNum,
      customerName: user.email,
      customerMobile: "",
      customerEmail: user.email,
      amount: amount.toFixed(2),
      currencyCode: "EGP",
      description: item.name,
      signature,
      chargeItems: [{ itemId: item.id, description: item.name, price: Number(item.priceEgp).toFixed(2), quantity }],
    };

    const fawryRes = await fetch(`${FAWRY_BASE_URL}/ECommerceWeb/Fawry/payments/charge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const fawryData = await fawryRes.json();

    return NextResponse.json({
      payment,
      fawryResponse: fawryData,
      checkoutUrl: fawryData?.paymentURL || null,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}

export async function fawryCallbackController(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantRefCode, paymentStatus, signature, ...rest } = body;

    const payment = await prisma.payment.findFirst({
      where: { providerRefNum: merchantRefCode },
    });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    const status = paymentStatus === "PAID" || paymentStatus === "SUCCESS" ? "completed" : "failed";

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status, metadata: { ...(payment.metadata as Record<string, unknown>), callback: rest } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 });
  }
}
