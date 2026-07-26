"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/Logo";
import { getErrorMessage } from "@/lib/errors";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg-primary">
      <div className="mb-6">
        <Logo />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">Something went wrong</h1>
      <p className="text-text-secondary mb-8 max-w-md text-center">
        {getErrorMessage(error) || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="bg-accent-gold text-black px-6 py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
