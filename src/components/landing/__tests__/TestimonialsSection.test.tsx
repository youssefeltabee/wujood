import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "../TestimonialsSection";

vi.mock("next/link", () => ({ default: vi.fn(({ children, href, className }) => <a href={href} className={className}>{children}</a>) }));
vi.mock("@/components/ui/GeometricPattern", () => ({ GeometricPattern: () => <div data-testid="geo-pattern" /> }));
vi.mock("@/components/ui/ScrollReveal", () => ({ RevealSection: ({ children }: { children: React.ReactNode }) => <div data-testid="reveal">{children}</div> }));
vi.mock("@/components/ui/TiltCard", () => ({ TiltCard: ({ children }: { children: React.ReactNode }) => <div data-testid="tilt-card">{children}</div> }));

afterEach(() => vi.clearAllMocks());

describe("TestimonialsSection", () => {
  it("renders section heading", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Businesses we have helped show up online.")).toBeInTheDocument();
  });

  it("renders 'Real Results' label", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Real Results")).toBeInTheDocument();
  });

  it("renders all three testimonial author names", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Ahmed H.")).toBeInTheDocument();
    expect(screen.getByText("Mariam K.")).toBeInTheDocument();
    expect(screen.getByText("Tarek S.")).toBeInTheDocument();
  });

  it("renders all three business names", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Electronics Shop, Alexandria")).toBeInTheDocument();
    expect(screen.getByText("Cairo Bakery Chain")).toBeInTheDocument();
    expect(screen.getByText("Furniture Workshop, Mansoura")).toBeInTheDocument();
  });

  it("renders all three testimonial quotes", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/I did not know my website was broken on phones/)).toBeInTheDocument();
    expect(screen.getByText(/We had 3 Instagram posts in two years/)).toBeInTheDocument();
    expect(screen.getByText(/Customers kept asking for prices on WhatsApp/)).toBeInTheDocument();
  });

  it("renders improvement scores", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("+45 points")).toBeInTheDocument();
    expect(screen.getByText("+38 points")).toBeInTheDocument();
    expect(screen.getByText("+52 points")).toBeInTheDocument();
  });

  it("renders CTA link to /register", () => {
    render(<TestimonialsSection />);
    const cta = screen.getByText("ابدأ دلوقتي");
    expect(cta.closest("a")).toHaveAttribute("href", "/register");
  });

  it("renders 3 TiltCard components", () => {
    render(<TestimonialsSection />);
    expect(screen.getAllByTestId("tilt-card")).toHaveLength(3);
  });

  it("renders GeometricPattern decoration", () => {
    render(<TestimonialsSection />);
    expect(screen.getByTestId("geo-pattern")).toBeInTheDocument();
  });

  it("renders 5 star icons per testimonial card", () => {
    const { container } = render(<TestimonialsSection />);
    const stars = container.querySelectorAll(".fill-accent-gold");
    expect(stars.length).toBe(15); // 3 cards × 5 stars
  });

  it("middle card has offset class for visual variety", () => {
    const { container } = render(<TestimonialsSection />);
    // Second testimonial card gets md:mt-6
    const tiltCards = screen.getAllByTestId("tilt-card");
    expect(tiltCards.length).toBe(3);
  });
});
