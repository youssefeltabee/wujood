import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProblemSection } from "../ProblemSection";

vi.mock("@/components/ui/ScrollReveal", () => ({ RevealSection: ({ children, className, ...props }: React.ComponentProps<"div">) => <div className={className} {...props}>{children}</div> }));
vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en", setLocale: vi.fn(), dir: "ltr",
    t: (key: string, params?: Record<string, string>) => {
      const dict: Record<string, string> = { "section.problem.label":"The Problem","section.problem.heading":"8 out of 10 Egyptian SMEs are invisible online.","section.problem.body":"That is roughly {amount} in missed business every year. Not because their product is bad — because customers could not find them when they needed them.","section.problem.pain.1":"No pricing on their website","section.problem.pain.2":"Social media dormant for months","section.problem.pain.3":"No online payment options","section.problem.pain.4":"Hard to find on Google","section.problem.stat":"of Egyptian SMEs have no real online presence","section.problem.source":"Based on an analysis of 500 Egyptian business websites" };
      let val = dict[key] ?? key;
      if (params) for (const [k, v] of Object.entries(params)) val = val.replace(`{${k}}`, v);
      return val;
    },
  }),
}));

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
    // Vertical rhythm comes from the --spacing-section token (Dark Luxe Cairo system)
    const revealEl = container.querySelector("#problem");
    expect(revealEl).toHaveClass("py-[var(--spacing-section)]");
  });

  it("has two-column grid layout on desktop", () => {
    const { container } = render(<ProblemSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("md:grid-cols-5");
  });

  it("renders the gold stat card with 80%", () => {
    const { container } = render(<ProblemSection />);
    // Card uses a gold gradient overlay, not a solid bg-accent-gold
    const goldCard = container.querySelector(".rounded-3xl");
    expect(goldCard).toBeInTheDocument();
    expect(goldCard!.querySelector(".bg-gradient-to-br")?.className).toContain("from-accent-gold");
    expect(goldCard!.querySelector(".text-8xl")?.textContent).toContain("80%");
  });
});
