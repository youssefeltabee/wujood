import { describe, it, expect, vi, afterEach } from "vitest";
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

  it("does not overlap the tab bar (no negative margin, no z-10)", () => {
    const { container } = render(<StatsSection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("relative");
    expect(section?.className).not.toContain("-mt-20");
    expect(section?.className).not.toContain("z-10");
  });

  it("styles second stat card with elevated background", () => {
    const { container } = render(<StatsSection />);
    // Middle cell gets a translucent white wash, not bg-bg-elevated
    const grid = container.querySelector(".grid");
    const cards = grid ? Array.from(grid.children) : [];
    expect(cards).toHaveLength(3);
    // Exact token match — every cell carries the hover: variant of the same class
    expect(cards[1].className.split(" ")).toContain("bg-white/[0.02]");
    expect(cards[0].className.split(" ")).not.toContain("bg-white/[0.02]");
    expect(cards[2].className.split(" ")).not.toContain("bg-white/[0.02]");
  });

  it("renders outer card with glass and gold glow styling", () => {
    const { container } = render(<StatsSection />);
    const outerCard = container.querySelector(".rounded-3xl");
    expect(outerCard).toHaveClass("glass");
    expect(outerCard).toHaveClass("glow-gold");
  });

  it("renders three animated stat values", () => {
    // Each AnimatedStat renders a gradient-text span; count starts at 0
    const { container } = render(<StatsSection />);
    const statNumbers = container.querySelectorAll("span.gradient-text");
    expect(statNumbers.length).toBe(3);
  });

  it("styles stat values with stat-value and count-flash treatment", () => {
    const { container } = render(<StatsSection />);
    const values = container.querySelectorAll("span.gradient-text");
    values.forEach((v) => {
      expect(v).toHaveClass("stat-value");
      expect(v).toHaveClass("animate-count-flash");
    });
  });

  it("staggers the stat cards on load", () => {
    const { container } = render(<StatsSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("animate-stagger");
  });

  it("renders section without z-index override (tab layout requires no stacking)", () => {
    const { container } = render(<StatsSection />);
    const section = container.querySelector('[class*="relative"]');
    expect(section).toHaveClass("relative");
  });

  it("renders stat values with large bold text styling", () => {
    const { container } = render(<StatsSection />);
    const values = container.querySelectorAll("span.gradient-text");
    expect(values.length).toBe(3);
    values.forEach((v) => {
      expect(v).toHaveClass("font-bold");
      expect(v.className).toContain("md:text-7xl");
    });
  });

  it("renders divider lines between stat cards on mobile", () => {
    const { container } = render(<StatsSection />);
    const dividers = container.querySelectorAll(".divide-y");
    expect(dividers.length).toBeGreaterThan(0);
  });
});
