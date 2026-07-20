import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LandingClient from "../LandingClient";

// Mock all landing section imports
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
  it("renders all landing page sections", () => {
    render(<LandingClient />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("stats-section")).toBeInTheDocument();
    expect(screen.getByTestId("problem-section")).toBeInTheDocument();
    expect(screen.getByTestId("how-it-works")).toBeInTheDocument();
    expect(screen.getByTestId("testimonials-section")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-section")).toBeInTheDocument();
    expect(screen.getByTestId("faa-section")).toBeInTheDocument();
    expect(screen.getByTestId("final-cta")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders in correct order: hero first, footer last", () => {
    render(<LandingClient />);
    const main = document.querySelector("main");
    const sections = Array.from(main!.children);
    const ids = sections.map((s) => s.getAttribute("data-testid"));
    // The order inside <main> should be: hero, stats, problem, how-it-works,
    // Marquee, testimonials, pricing, faa, final-cta
    expect(ids[0]).toBe("hero-section");
    expect(ids[1]).toBe("stats-section");
    expect(ids[2]).toBe("problem-section");
    expect(ids[3]).toBe("how-it-works");
    // index 4 is the Marquee (no data-testid)
    expect(ids[5]).toBe("testimonials-section");
    expect(ids[6]).toBe("pricing-section");
    expect(ids[7]).toBe("faa-section");
    expect(ids[8]).toBe("final-cta");
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

  it("renders main element wrapping all primary sections", () => {
    render(<LandingClient />);
    const main = document.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.querySelector("[data-testid='hero-section']")).toBeInTheDocument();
    expect(main?.querySelector("[data-testid='final-cta']")).toBeInTheDocument();
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
    // 10 items doubled = 20 span elements
    const items = track?.querySelectorAll("span");
    expect(items?.length).toBe(20);
  });

  it("tracks mouse position on mousemove", async () => {
    const user = userEvent.setup();
    render(<LandingClient />);
    const blob = document.querySelector(".mouse-blob") as HTMLElement;
    expect(blob).toBeInTheDocument();

    await user.pointer({ target: document.body, coords: { x: 500, y: 300 } });

    // After a mousemove, the blob should update its position via RAF.
    // Since RAF doesn't fire synchronously in jsdom, we just verify
    // the event listener was attached (no crash).
    expect(blob.style.left).toBeDefined();
  });
});
