interface WebsitePreviewProps { website: any }

export function WebsitePreview({ website }: WebsitePreviewProps) {
  if (!website) return <div className="text-center text-gray-500 py-8">لم يتم العثور على الموقع</div>

  const section = (type: string) => website.structure?.sections?.find((s: any) => s.type === type)
  const content = (type: string) => section(type)?.content || {}

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-400">{website.subdomain}.wujood.app</span>
      </div>
      <div className="p-6 space-y-8">
        {content("hero")?.title && (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{content("hero").title}</h1>
            {content("hero").subtitle && <p className="text-gray-600 mt-2">{content("hero").subtitle}</p>}
          </div>
        )}
        {website.structure?.sections?.filter((s: any) => s.type !== "hero").map((s: any, i: number) => (
          <div key={i} className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{s.content?.title || s.type}</h2>
            {s.content?.subtitle && <p className="text-gray-600">{s.content.subtitle}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
