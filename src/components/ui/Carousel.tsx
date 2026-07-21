"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export interface CarouselProps {
  slides: ReactNode[];
  ariaLabel?: string;
  autoPlayMs?: number;
  controls?: boolean;
}

export function Carousel({
  slides,
  ariaLabel = "Carousel",
  autoPlayMs = 6000,
  controls = true,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const items = Array.from(track.children) as HTMLElement[];
      if (items.length === 0) return;
      const target = ((index % items.length) + items.length) % items.length;
      items[target]?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        inline: "start",
        block: "nearest",
      });
      setActive(target);
    },
    [reduced],
  );

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let closestDist = Infinity;
    items.forEach((el, i) => {
      const dist = Math.abs(el.offsetLeft - track.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive((prev) => (prev !== closest ? closest : prev));
  }, []);

  useEffect(() => {
    if (paused || reduced || slides.length <= 1) return;
    const id = setInterval(() => goTo(active + 1), autoPlayMs);
    return () => clearInterval(id);
  }, [paused, reduced, active, autoPlayMs, goTo, slides.length]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className="snap-center shrink-0 w-full"
          >
            {slide}
          </div>
        ))}
      </div>

      {controls && slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goTo(active - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-10 grid place-items-center w-11 h-11 rounded-full bg-bg-surface/80 border border-border-subtle text-text-primary backdrop-blur hover:border-accent-gold hover:text-accent-gold transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goTo(active + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-10 grid place-items-center w-11 h-11 rounded-full bg-bg-surface/80 border border-border-subtle text-text-primary backdrop-blur hover:border-accent-gold hover:text-accent-gold transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === active ? "w-6 bg-accent-gold" : "w-2 bg-border-subtle hover:bg-text-muted"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
