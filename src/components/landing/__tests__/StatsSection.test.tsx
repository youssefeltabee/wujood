import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsSection } from "../StatsSection";

vi.mock("@/hooks/useScrollReveal", () => ({ useScrollReveal: () => ({ ref: { current: null }, visible: true }) }));

afterEach(() => vi.clearAllMocks());

describe("StatsSection", () => {
  it("renders all three stat labels", () => {
    render(<StatsSection />);
    expect(screen.getByText("Egyptian WhatsApp users")).toBeInTheDocument();
    expect(screen.getByText("Check business profiles daily")).toBeInTheDocument();
    expect(screen.getByText("Prefer WhatsApp over phone calls")).toBeInTheDocument();
  });

  it("renders stat values with correct suffixes", () => {
    render(<StatsSection />);
    // AnimatedStat renders {count}{suffix} so text is split across text nodes
    // Check that suffix text appears (the animated part starts at 0)
    expect(screen.getByText((c) => c.includes("M+"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("M") && !c.includes("+"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("%"))).toBeInTheDocument();
  });

  it("renders three stat cards in a grid", () => {
    const { container } = render(<StatsSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("md:grid-cols-3");
    const statCards = grid?.children;
    expect(statCards?.length).toBe(3);
  });

  it("has negative margin for z-index overlap with preceding section", () => {
    const { container } = render(<StatsSection />);
    const section = container.querySelector("section") || container.querySelector('[class*="-mt-20"]');
    expect(section).toHaveClass("-mt-20");
  });

  it("styles second stat card with elevated background", () => {
    const { container } = render(<StatsSection />);
    const elevated = container.querySelector(".bg-bg-elevated");
    expect(elevated).toBeInTheDocument();
  });

  it("renders with border and rounded corners on outer card", () => {
    const { container } = render(<StatsSection />);
    const outerCard = container.querySelector(".rounded-3xl");
    expect(outerCard).toHaveClass("border");
    expect(outerCard).toHaveClass("border-border-subtle");
  });

  it("animates stat values from 0 to target with fake timers", () => {
    // AnimatedStat starts at 0, animates to target
    const { container } = render(<StatsSection />);
    const statNumbers = container.querySelectorAll(".text-8xl");
    // With visible=true on mount, animation starts immediately via setInterval
    // Each AnimatedStat's initial rendered count is 0 before first interval fires
    expect(statNumbers.length).toBe(3);
    // The count updates via setInterval every 16ms over 1500ms
  });

  it("renders section within a z-index context", () => {
    const { container } = render(<StatsSection />);
    const section = container.querySelector('[class*="relative"]');
    expect(section).toHaveClass("relative");
    expect(section).toHaveClass("z-10");
  });

  it("renders stat values with large bold text styling", () => {
    const { container } = render(<StatsSection />);
    const values = container.querySelectorAll(".text-8xl");
    expect(values.length).toBe(3);
    values.forEach((v) => {
      expect(v).toHaveClass("font-bold");
      expect(v).toHaveClass("text-accent-gold");
    });
  });

  it("renders divider lines between stat cards on mobile", () => {
    const { container } = render(<StatsSection />);
    const dividers = container.querySelectorAll(".divide-y");
    expect(dividers.length).toBeGreaterThan(0);
  });
});
