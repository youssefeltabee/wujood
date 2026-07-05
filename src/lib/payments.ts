import crypto from "crypto"
import axios from "axios"

const FAWRY_API_KEY = process.env.FAWRY_API_KEY || ""
const FAWRY_API_SECRET = process.env.FAWRY_API_SECRET || ""
const FAWRY_BASE_URL = process.env.FAWRY_BASE_URL || "https://atfawry.com/ECommerceWeb/Fawry/payments"

export interface FawryPaymentRequest {
  merchantCode: string; merchantRefNum: string; customerMobile: string
  customerEmail: string; customerName: string; paymentAmount: number
  chargeItems: { itemId: string; description: string; price: number; quantity: number }[]
  returnUrl: string; authCaptureModePayment: boolean
}

export function generateFawrySignature(params: Record<string, any>): string {
  const sorted = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&")
  return crypto.createHmac("sha256", FAWRY_API_SECRET).update(sorted).digest("hex")
}

export async function createFawryPaymentLink(refNum: string, amount: number, customer: { name: string; mobile: string; email: string }, items: { id: string; desc: string; price: number }[]) {
  const payload: FawryPaymentRequest = {
    merchantCode: FAWRY_API_KEY, merchantRefNum: refNum, customerMobile: customer.mobile,
    customerEmail: customer.email, customerName: customer.name, paymentAmount: amount,
    chargeItems: items.map((i) => ({ itemId: i.id, description: i.desc, price: i.price, quantity: 1 })),
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
    authCaptureModePayment: true,
  }

  const signature = generateFawrySignature({
    merchantCode: payload.merchantCode, merchantRefNum: payload.merchantRefNum,
    paymentAmount: payload.paymentAmount, customerMobile: payload.customerMobile, customerEmail: payload.customerEmail,
  })

  try {
    const response = await axios.post(`${FAWRY_BASE_URL}/charges`, { ...payload, signature })
    return response.data
  } catch (error) {
    console.error("Fawry payment error:", error)
    throw new Error("فشل في إنشاء رابط الدفع")
  }
}

export async function verifyFawryPayment(merchantRefNum: string) {
  const signature = generateFawrySignature({ merchantCode: FAWRY_API_KEY, merchantRefNum })
  try {
    const response = await axios.get(`${FAWRY_BASE_URL}/status`, { params: { merchantCode: FAWRY_API_KEY, merchantRefNum, signature } })
    return response.data
  } catch (error) {
    console.error("Fawry verification error:", error)
    return null
  }
}
