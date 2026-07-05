import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyPassword, createToken, setTokenCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })

    const valid = await verifyPassword(password, user.password)
    if (!valid) return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 })

    const token = createToken(user.id)
    await setTokenCookie(token)

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch { return NextResponse.json({ error: "حدث خطأ أثناء تسجيل الدخول" }, { status: 500 }) }
}
