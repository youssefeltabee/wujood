import Link from "next/link";

export function Logo({ href = "/", showWordmark = true }: { href?: string; showWordmark?: boolean }) {
  const mark = (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" stroke="#0D7377" strokeWidth="2" />
        <path d="M10 20c0-4 2-8 6-8s6 4 6 8" stroke="#0D7377" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 22c0-3 1.5-5.5 4-5.5s4 2.5 4 5.5" stroke="#C85A48" strokeWidth="2" strokeLinecap="round" />
        <circle cx="22" cy="10" r="1.5" fill="#C85A48" />
      </svg>
      {showWordmark && (
        <>
          <span className="font-bold text-w-charcoal">Wujood</span>
          <span className="text-w-teal font-bold" dir="rtl">وجود</span>
        </>
      )}
    </div>
  );

  if (href) return <Link href={href}>{mark}</Link>;
  return mark;
}
