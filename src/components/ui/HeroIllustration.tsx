export function HeroIllustration() {
  return (
    <div className="relative">
      <div className="bg-bg-surface rounded-2xl shadow-xl border border-border-subtle p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-text-muted font-medium">wujood.app/audit</span>
        </div>
        <div className="text-center mb-5">
          <div className="text-5xl font-bold text-white mb-1">34</div>
          <div className="text-xs text-text-secondary uppercase tracking-wider">Digital Presence Score</div>
          <div className="mt-2 inline-block bg-bg-elevated text-accent-gold text-xs font-semibold px-3 py-1 rounded-full">Faint Signal</div>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "Mobile", pct: 70 },
            { label: "Speed", pct: 40 },
            { label: "SEO", pct: 20 },
            { label: "Social", pct: 10 },
            { label: "Pricing", pct: 30 },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-text-secondary">{bar.label}</span>
                <span className="text-text-muted">{bar.pct}%</span>
              </div>
              <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${bar.pct}%`, backgroundColor: bar.pct < 30 ? "#ef4444" : bar.pct < 60 ? "#f97316" : "#22c55e" }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between text-xs text-text-muted">
          <span>10 categories checked</span>
          <span className="text-accent-gold font-medium">View full report →</span>
        </div>
      </div>
    </div>
  );
}
