import { cn } from "@/lib/utils";

const variants = {
  text: "h-4 w-full rounded",
  circle: "rounded-full",
  card: "h-32 rounded-xl",
};

interface SkeletonProps {
  variant?: keyof typeof variants;
  className?: string;
}

function Skeleton({ variant = "text", className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-bg-elevated",
        variants[variant],
        !className?.includes("w-") && !className?.includes("size-") && "w-full",
        className
      )}
      aria-hidden="true"
    />
  );
}
Skeleton.displayName = "Skeleton";

export { Skeleton };
export type { SkeletonProps };
