import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { SettingsForm } from "./settings-form"

export default async function SettingsPage() {
  const user = await getSession()
  if (!user) redirect("/login")

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">الإعدادات</h1>
      <Card>
        <SettingsForm user={{ name: user.name, email: user.email, phone: user.phone || "" }} />
      </Card>
    </div>
  )
}
