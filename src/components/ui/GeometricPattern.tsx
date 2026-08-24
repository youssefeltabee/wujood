export function GeometricPattern({ className = "", opacity = 0.04 }: { className?: string; opacity?: number }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity, color: "var(--color-accent-gold, #D4A853)" }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="mashrabiya" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="none" />
            <circle cx="40" cy="40" r="18" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="40" cy="40" r="10" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <rect x="20" y="20" width="40" height="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <line x1="10" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="0.3" />
            <line x1="40" y1="10" x2="40" y2="70" stroke="currentColor" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mashrabiya)" />
      </svg>
    </div>
  );
}
