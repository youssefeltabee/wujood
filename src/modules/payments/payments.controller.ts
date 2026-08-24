import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { handleApiError } from "@/lib/errors";
import * as paymentsService from "./payments.service";
import crypto from "crypto";

const FAWRY_MERCHANT_CODE = process.env.FAWRY_MERCHANT_CODE || "";
const FAWRY_SECURITY_KEY = process.env.FAWRY_SECURITY_KEY || "";
const FAWRY_BASE_URL = process.env.FAWRY_BASE_URL || "https://atfawry.fawrypay.com/api";

function generateFawrySignature(merchantRefNum: string, merchantCode: string, amount: number, securityKey: string) {
  const data = `${merchantRefNum}${merchantCode}${amount.toFixed(2)}${securityKey}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

function verifyFawryCallbackSignature(
  merchantRefCode: string, paymentStatus: string, signature: string, securityKey: string, merchantCode: string,
) {
  const data = `${merchantRefCode}${paymentStatus}${merchantCode}${securityKey}`;
  const expected = crypto.createHash("sha256").update(data).digest("hex");
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function createFawryCheckoutController(req: NextRequest) {
  try {
    const user = await authenticateUser();
    const { catalogItemId, quantity = 1 } = await req.json();
    if (!catalogItemId) return NextResponse.json({ error: "catalogItemId is required" }, { status: 400 });

    const item = await paymentsService.getCatalogItemForPayment(catalogItemId, user.userId);
    const amount = Number(item.priceEgp) * quantity;
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid price" }, { status: 400 });

    const merchantRefNum = `wujood-${user.userId}-${Date.now()}`;
    const payment = await paymentsService.createPayment(user.userId, {
      amount,
      currency: "EGP",
      provider: "fawry",
      providerRefNum: merchantRefNum,
      metadata: { catalogItemId, quantity, itemName: item.name },
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
  } catch (err) {
    return handleApiError(err);
  }
}

export async function fawryCallbackController(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantRefCode, paymentStatus, signature, ...rest } = body;

    if (!FAWRY_SECURITY_KEY || !FAWRY_MERCHANT_CODE) {
      return NextResponse.json({ error: "Fawry not configured" }, { status: 500 });
    }
    if (!signature || !verifyFawryCallbackSignature(merchantRefCode, paymentStatus, signature, FAWRY_SECURITY_KEY, FAWRY_MERCHANT_CODE)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payment = await paymentsService.findPaymentByRef(merchantRefCode);
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (payment.status === "completed") return NextResponse.json({ success: true });

    const isPaid = paymentStatus === "PAID" || paymentStatus === "SUCCESS";
    if (isPaid) {
      const claimedAmount = Number(body.amount ?? rest.amountPaid ?? NaN);
      const storedAmount = Math.round(Number(payment.amount));
      if (!Number.isFinite(claimedAmount) || Math.round(claimedAmount) !== storedAmount) {
        console.error(
          `[Fawry] Amount mismatch for ${merchantRefCode}: callback=${body.amount} stored=${storedAmount} — refusing to complete`,
        );
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }
      await paymentsService.completePayment(payment.id, rest);
    } else {
      await paymentsService.failPayment(payment.id, rest);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err);
  }
}
