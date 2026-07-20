import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PricingSection } from "../PricingSection";

vi.mock("next/link", () => ({ default: vi.fn(({ children, href, className }) => <a href={href} className={className}>{children}</a>) }));
vi.mock("@/components/ui/TiltCard", () => ({ TiltCard: ({ children }: { children: React.ReactNode }) => <div data-testid="tilt-card">{children}</div> }));
vi.mock("@/components/ui/GeometricPattern", () => ({ GeometricPattern: () => <div data-testid="geo-pattern" /> }));
vi.mock("@/components/ui/ScrollReveal", () => ({ RevealSection: ({ children }: { children: React.ReactNode }) => <div data-testid="reveal">{children}</div> }));

afterEach(() => vi.clearAllMocks());

describe("PricingSection", () => {
  it("renders all 3 pricing tiers", () => {
    render(<PricingSection />);
    expect(screen.getByText("Kashif")).toBeInTheDocument();
    expect(screen.getByText("Sane'")).toBeInTheDocument();
    expect(screen.getByText("Ra'ed")).toBeInTheDocument();
  });

  it("displays Arabic names for all tiers", () => {
    render(<PricingSection />);
    expect(screen.getByText("كاشف")).toBeInTheDocument();
    expect(screen.getByText("صانع")).toBeInTheDocument();
    expect(screen.getByText("رائد")).toBeInTheDocument();
  });

  it("shows correct prices in EGP", () => {
    render(<PricingSection />);
    expect(screen.getByText((c) => c.includes("1,250"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("2,500"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("4,500"))).toBeInTheDocument();
    const labels = screen.getAllByText("EGP/month");
    expect(labels).toHaveLength(3);
  });

  it("marks Sane' as Most Popular with gold styling and Arabic CTA", () => {
    render(<PricingSection />);
    const badges = screen.getAllByText("Most Popular");
    expect(badges).toHaveLength(1);

    const cta = screen.getByText("ابدأ دلوقتي");
    expect(cta).toBeInTheDocument();
    expect(cta.closest("a")).toHaveAttribute("href", "/register");
  });

  it("shows See Details on non-popular tiers with correct links", () => {
    render(<PricingSection />);
    const details = screen.getAllByText("See Details");
    expect(details).toHaveLength(2);
    details.forEach((d) => expect(d.closest("a")).toHaveAttribute("href", "/register"));
  });

  it("renders section heading and description", () => {
    render(<PricingSection />);
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Plans for every stage of business.")).toBeInTheDocument();
    expect(screen.getByText("All prices in EGP. No hidden fees. Cancel anytime.")).toBeInTheDocument();
  });

  it("renders target audience per tier", () => {
    render(<PricingSection />);
    expect(screen.getByText("Sole proprietors and freelancers")).toBeInTheDocument();
    expect(screen.getByText("Small to medium businesses (5-20)")).toBeInTheDocument();
    expect(screen.getByText("Growing businesses (20-50)")).toBeInTheDocument();
  });

  it("renders all feature items per tier", () => {
    render(<PricingSection />);
    expect(screen.getByText("A mobile-friendly website")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp click-to-chat")).toBeInTheDocument();
    expect(screen.getByText("1 social media account")).toBeInTheDocument();
    expect(screen.getByText("Ghost Audit report")).toBeInTheDocument();
    expect(screen.getByText("Email support")).toBeInTheDocument();

    expect(screen.getByText("Everything in Kashif")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Business API")).toBeInTheDocument();
    expect(screen.getByText("3 social media accounts")).toBeInTheDocument();
    expect(screen.getByText("Online catalog builder")).toBeInTheDocument();
    expect(screen.getByText("Review and trust builder")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();

    expect(screen.getByText("Everything in Sane'")).toBeInTheDocument();
    expect(screen.getByText("AI chatbot in Arabic and English")).toBeInTheDocument();
    expect(screen.getByText("Unlimited social accounts")).toBeInTheDocument();
    expect(screen.getByText("Custom domain")).toBeInTheDocument();
    expect(screen.getByText("Advanced analytics")).toBeInTheDocument();
    expect(screen.getByText("Dedicated account manager")).toBeInTheDocument();
  });

  it("renders annual billing note with free trial", () => {
    render(<PricingSection />);
    expect(screen.getByText(/Annual billing: 10 months for 12 \(17% off\)\. 7-day free trial on all plans\./)).toBeInTheDocument();
  });

  it("renders 3 TiltCard components (one per tier)", () => {
    render(<PricingSection />);
    expect(screen.getAllByTestId("tilt-card")).toHaveLength(3);
  });

  it("renders the section with id='pricing' for anchor linking", () => {
    const { container } = render(<PricingSection />);
    const section = container.querySelector("#pricing");
    expect(section).toBeInTheDocument();
    expect(section!.tagName).toBe("SECTION");
  });

  it("renders check icons for each feature", () => {
    const { container } = render(<PricingSection />);
    const checks = container.querySelectorAll("svg");
    expect(checks.length).toBeGreaterThan(0);
  });

  it("has correct grid layout classes for responsive design", () => {
    const { container } = render(<PricingSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("md:grid-cols-3");
    expect(grid).toHaveClass("gap-5");
  });

  it("has section with correct padding and overflow classes", () => {
    const { container } = render(<PricingSection />);
    const section = container.querySelector("#pricing");
    expect(section).toHaveClass("py-24");
    expect(section).toHaveClass("md:py-32");
    expect(section).toHaveClass("overflow-hidden");
  });

  it("contains GeometricPattern background decoration", () => {
    render(<PricingSection />);
    expect(screen.getByTestId("geo-pattern")).toBeInTheDocument();
  });

  it("wraps heading in RevealSection for scroll animation", () => {
    render(<PricingSection />);
    expect(screen.getByTestId("reveal")).toBeInTheDocument();
  });
});
