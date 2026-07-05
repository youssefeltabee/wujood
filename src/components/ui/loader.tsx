export function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <span className="mr-3 text-gray-500">جارٍ التحميل...</span>
    </div>
  )
}
