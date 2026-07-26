import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingClient from "../LandingClient";

vi.mock("@/components/landing/HeroSection", () => ({
  HeroSection: () => <section data-testid="hero-section">Hero</section>,
}));
vi.mock("@/components/landing/StatsSection", () => ({
  StatsSection: () => <section data-testid="stats-section">Stats</section>,
}));
vi.mock("@/components/landing/ProblemSection", () => ({
  ProblemSection: () => <section data-testid="problem-section">Problem</section>,
}));
vi.mock("@/components/landing/HowItWorks", () => ({
  HowItWorks: () => <section data-testid="how-it-works">How It Works</section>,
}));
vi.mock("@/components/landing/TestimonialsSection", () => ({
  TestimonialsSection: () => (
    <section data-testid="testimonials-section">Testimonials</section>
  ),
}));
vi.mock("@/components/landing/PricingSection", () => ({
  PricingSection: () => <section data-testid="pricing-section">Pricing</section>,
}));
vi.mock("@/components/landing/FAASection", () => ({
  FAASection: () => <section data-testid="faa-section">FAA</section>,
}));
vi.mock("@/components/landing/FinalCTASection", () => ({
  FinalCTASection: () => <section data-testid="final-cta">CTA</section>,
}));
vi.mock("@/components/landing/FooterSection", () => ({
  FooterSection: () => <footer data-testid="footer">Footer</footer>,
}));
vi.mock("@/components/ui/WhatsAppButton", () => ({
  WhatsAppButton: () => <div data-testid="whatsapp-btn">WhatsApp</div>,
}));

describe("LandingClient", () => {
  it("renders hero-section, tab bar, and final-cta inside main", () => {
    render(<LandingClient />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("final-cta")).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("shows problem tab content by default (stats + problem + marquee)", () => {
    render(<LandingClient />);
    expect(screen.getByTestId("stats-section")).toBeInTheDocument();
    expect(screen.getByTestId("problem-section")).toBeInTheDocument();
  });

  it("hides tabs other than the active one", () => {
    render(<LandingClient />);
    expect(screen.queryByTestId("how-it-works")).not.toBeInTheDocument();
    expect(screen.queryByTestId("testimonials-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pricing-section")).not.toBeInTheDocument();
    expect(screen.queryByTestId("faa-section")).not.toBeInTheDocument();
  });

  it("switches tab content on tab click", async () => {
    const user = userEvent.setup();
    render(<LandingClient />);
    await user.click(screen.getByText("كيف يعمل"));
    expect(screen.getByTestId("how-it-works")).toBeInTheDocument();
    expect(screen.queryByTestId("stats-section")).not.toBeInTheDocument();
  });

  it("renders all 5 tab labels in the tab bar", () => {
    render(<LandingClient />);
    expect(screen.getByText("المشكلة")).toBeInTheDocument();
    expect(screen.getByText("كيف يعمل")).toBeInTheDocument();
    expect(screen.getByText("المميزات")).toBeInTheDocument();
    expect(screen.getByText("آراء العملاء")).toBeInTheDocument();
    expect(screen.getByText("الأسعار")).toBeInTheDocument();
  });

  it("renders hero before tabs, final-cta after tabs, footer outside main", () => {
    render(<LandingClient />);
    const main = document.querySelector("main")!;
    const children = Array.from(main.children);
    expect(children[0]).toHaveAttribute("data-testid", "hero-section");
    expect(children[children.length - 1]).toHaveAttribute("data-testid", "final-cta");
    const footer = screen.getByTestId("footer");
    expect(footer.closest("main")).toBeNull();
  });

  it("renders WhatsAppButton", () => {
    render(<LandingClient />);
    expect(screen.getByTestId("whatsapp-btn")).toBeInTheDocument();
  });

  it("renders Marquee with business type items", () => {
    render(<LandingClient />);
    const arabicWords = ["محلات", "مطاعم", "ورش", "عيادات", "مدارس"];
    arabicWords.forEach((word) => {
      const elements = screen.getAllByText(word);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders FooterSection outside the <main> element", () => {
    render(<LandingClient />);
    const footer = screen.getByTestId("footer");
    expect(footer.closest("main")).toBeNull();
  });

  it("renders WhatsAppButton outside <main>", () => {
    render(<LandingClient />);
    const waba = screen.getByTestId("whatsapp-btn");
    expect(waba.closest("main")).toBeNull();
  });

  it("renders MouseBlob element with aria-hidden", () => {
    const { container } = render(<LandingClient />);
    const blob = container.querySelector(".mouse-blob");
    expect(blob).toBeInTheDocument();
    expect(blob).toHaveAttribute("aria-hidden", "true");
  });

  it("MouseBlob is hidden on mobile (hidden md:block classes)", () => {
    const { container } = render(<LandingClient />);
    const blob = container.querySelector(".mouse-blob");
    expect(blob?.className).toContain("hidden");
    expect(blob?.className).toContain("md:block");
  });

  it("Marquee track contains doubled items", () => {
    const { container } = render(<LandingClient />);
    const track = container.querySelector(".marquee-track");
    expect(track).toBeInTheDocument();
    const items = track?.querySelectorAll("span");
    expect(items?.length).toBe(20);
  });
});
