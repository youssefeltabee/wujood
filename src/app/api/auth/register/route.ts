import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, createToken, setTokenCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, plan } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "البريد الإلكتروني مسجل بالفعل" }, { status: 409 })

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } })

    const token = createToken(user.id)
    await setTokenCookie(token)

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) { return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الحساب" }, { status: 500 }) }
}
