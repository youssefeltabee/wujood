import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FinalCTASection } from "../FinalCTASection";

vi.mock("@/components/ui/ScrollReveal", () => ({ RevealSection: ({ children }: { children: React.ReactNode }) => <div data-testid="reveal">{children}</div> }));
vi.mock("@/components/audit/AuditForm", () => ({ AuditForm: () => <div data-testid="audit-form" /> }));
vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    setLocale: vi.fn(),
    dir: "ltr",
    t: (key: string) => {
      const dict: Record<string, string> = {
        "section.cta.label": "Start Free — 30 Seconds",
        "section.cta.heading": "See where your business stands.",
        "section.cta.subtext": "Enter your website URL. Get a free Digital Presence Score and a full breakdown of what is missing. It takes 30 seconds.",
      };
      return dict[key] ?? key;
    },
  }),
}));

afterEach(() => vi.clearAllMocks());

describe("FinalCTASection", () => {
  it("renders the CTA headline", () => {
    render(<FinalCTASection />);
    expect(screen.getByText("See where your business stands.")).toBeInTheDocument();
  });

  it("renders a section-label eyebrow above the headline", () => {
    render(<FinalCTASection />);
    expect(screen.getByText("Start Free — 30 Seconds")).toHaveClass("section-label");
  });

  it("renders the description paragraph", () => {
    render(<FinalCTASection />);
    expect(screen.getByText(/Enter your website URL/)).toBeInTheDocument();
    expect(screen.getByText(/Get a free Digital Presence Score/)).toBeInTheDocument();
    expect(screen.getByText(/It takes 30 seconds/)).toBeInTheDocument();
  });

  it("renders AuditForm component", () => {
    render(<FinalCTASection />);
    expect(screen.getByTestId("audit-form")).toBeInTheDocument();
  });

  it("wraps content in RevealSection for scroll animation", () => {
    render(<FinalCTASection />);
    expect(screen.getByTestId("reveal")).toBeInTheDocument();
  });

  it("renders gold accent glow orb", () => {
    const { container } = render(<FinalCTASection />);
    const orb = container.querySelector(".rounded-full.blur-3xl");
    expect(orb).toBeInTheDocument();
    expect(orb!.className).toContain("bg-accent-gold/5");
  });

  it("has correct responsive padding classes", () => {
    const { container } = render(<FinalCTASection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-[var(--spacing-section)]");
  });

  it("renders AuditForm in a glass panel with grain", () => {
    const { container } = render(<FinalCTASection />);
    const card = container.querySelector(".glass-panel");
    expect(card).not.toBeNull();
    expect(card!.querySelector(".grain")).toBeInTheDocument();
    expect(card!.querySelector('[data-testid="audit-form"]')).toBeInTheDocument();
  });

  it("has max-width constrained content area", () => {
    const { container } = render(<FinalCTASection />);
    const maxW = container.querySelector(".max-w-2xl");
    expect(maxW).toBeInTheDocument();
    expect(maxW).toHaveClass("mx-auto");
    expect(maxW).toHaveClass("text-center");
  });

  it("renders section with animated gradient background", () => {
    const { container } = render(<FinalCTASection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("relative");
    expect(section).toHaveClass("overflow-hidden");
    expect(section!.querySelector(".animated-gradient-bg")).toBeInTheDocument();
  });
});
