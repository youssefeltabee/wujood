import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FinalCTASection } from "../FinalCTASection";

vi.mock("@/components/ui/ScrollReveal", () => ({ RevealSection: ({ children }: { children: React.ReactNode }) => <div data-testid="reveal">{children}</div> }));
vi.mock("@/components/audit/AuditForm", () => ({ AuditForm: () => <div data-testid="audit-form" /> }));

afterEach(() => vi.clearAllMocks());

describe("FinalCTASection", () => {
  it("renders the CTA headline", () => {
    render(<FinalCTASection />);
    expect(screen.getByText("See where your business stands.")).toBeInTheDocument();
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

  it("renders gold accent divider line", () => {
    const { container } = render(<FinalCTASection />);
    const divider = container.querySelector(".h-px");
    expect(divider).toHaveClass("bg-accent-gold/20");
  });

  it("has correct responsive padding classes", () => {
    const { container } = render(<FinalCTASection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-24");
    expect(section).toHaveClass("md:py-28");
  });

  it("has max-width constrained content area", () => {
    const { container } = render(<FinalCTASection />);
    const maxW = container.querySelector(".max-w-2xl");
    expect(maxW).toBeInTheDocument();
    expect(maxW).toHaveClass("mx-auto");
    expect(maxW).toHaveClass("text-center");
  });

  it("renders section with correct background", () => {
    const { container } = render(<FinalCTASection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("bg-bg-elevated");
  });
});
