import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemSection } from "../ProblemSection";

vi.mock("@/components/ui/ScrollReveal", () => ({ RevealSection: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div> }));

afterEach(() => vi.clearAllMocks());

describe("ProblemSection", () => {
  it("renders the main headline", () => {
    render(<ProblemSection />);
    expect(screen.getByText("8 out of 10 Egyptian SMEs are invisible online.")).toBeInTheDocument();
  });

  it("renders 'The Problem' label", () => {
    render(<ProblemSection />);
    expect(screen.getByText("The Problem")).toBeInTheDocument();
  });

  it("renders the missed revenue stat in description", () => {
    render(<ProblemSection />);
    expect(screen.getByText(/3.5 billion EGP/)).toBeInTheDocument();
  });

  it("renders all four pain point items", () => {
    render(<ProblemSection />);
    expect(screen.getByText("No pricing on their website")).toBeInTheDocument();
    expect(screen.getByText("Social media dormant for months")).toBeInTheDocument();
    expect(screen.getByText("No online payment options")).toBeInTheDocument();
    expect(screen.getByText("Hard to find on Google")).toBeInTheDocument();
  });

  it("renders the 80% stat card with description", () => {
    render(<ProblemSection />);
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("of Egyptian SMEs have no real online presence")).toBeInTheDocument();
  });

  it("renders the source attribution", () => {
    render(<ProblemSection />);
    expect(screen.getByText(/Based on an analysis of 500 Egyptian business websites/)).toBeInTheDocument();
  });

  it("has id 'problem' for anchor linking", () => {
    const { container } = render(<ProblemSection />);
    const el = container.querySelector("#problem");
    expect(el).toBeInTheDocument();
  });

  it("renders pain point icon SVGs", () => {
    const { container } = render(<ProblemSection />);
    const painIcons = container.querySelectorAll(".pain-point-icon svg");
    expect(painIcons.length).toBe(4);
  });

  it("has correct responsive padding", () => {
    const { container } = render(<ProblemSection />);
    const section = container.querySelector("section") || container.querySelector("#problem")?.closest("section") || container.querySelector('[class*="py-24"]');
    // The RevealSection wrapping means the outer element has the classes
    const revealEl = container.querySelector('[class*="py-24"]');
    expect(revealEl).toHaveClass("py-24");
    expect(revealEl).toHaveClass("md:py-32");
  });

  it("has two-column grid layout on desktop", () => {
    const { container } = render(<ProblemSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("md:grid-cols-5");
  });

  it("renders the gold stat card with 80%", () => {
    const { container } = render(<ProblemSection />);
    const goldCard = container.querySelector(".bg-accent-gold");
    expect(goldCard).toBeInTheDocument();
    expect(goldCard!.querySelector(".text-8xl")?.textContent).toContain("80%");
  });
});
