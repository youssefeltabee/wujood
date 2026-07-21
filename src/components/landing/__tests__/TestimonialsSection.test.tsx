import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TestimonialsSection } from "../TestimonialsSection";

vi.mock("next/link", () => ({ default: vi.fn(({ children, href, className }) => <a href={href} className={className}>{children}</a>) }));
vi.mock("@/components/ui/GeometricPattern", () => ({ GeometricPattern: () => <div data-testid="geo-pattern" /> }));
vi.mock("@/components/ui/Carousel", () => ({
  Carousel: ({ slides, ariaLabel }: { slides: React.ReactNode[]; ariaLabel: string }) => (
    <div data-testid="carousel" aria-label={ariaLabel}>
      {slides.map((slide, i) => <div key={i} data-testid="carousel-slide">{slide}</div>)}
    </div>
  ),
}));

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

  it("renders all five testimonial author names", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Ahmed H.")).toBeInTheDocument();
    expect(screen.getByText("Mariam K.")).toBeInTheDocument();
    expect(screen.getByText("Tarek S.")).toBeInTheDocument();
    expect(screen.getByText("Laila M.")).toBeInTheDocument();
    expect(screen.getByText("Omar F.")).toBeInTheDocument();
  });

  it("renders all five business names", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("Electronics Shop, Alexandria")).toBeInTheDocument();
    expect(screen.getByText("Cairo Bakery Chain")).toBeInTheDocument();
    expect(screen.getByText("Furniture Workshop, Mansoura")).toBeInTheDocument();
    expect(screen.getByText("Beauty Salon, Giza")).toBeInTheDocument();
    expect(screen.getByText("Auto Parts, Tanta")).toBeInTheDocument();
  });

  it("renders all five testimonial quotes", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/I did not know my website was broken on phones/)).toBeInTheDocument();
    expect(screen.getByText(/We had 3 Instagram posts in two years/)).toBeInTheDocument();
    expect(screen.getByText(/Customers kept asking for prices on WhatsApp/)).toBeInTheDocument();
    expect(screen.getByText(/The audit showed my booking link was dead/)).toBeInTheDocument();
    expect(screen.getByText(/Honestly I thought digital presence was for big companies/)).toBeInTheDocument();
  });

  it("renders improvement scores", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("+45 points")).toBeInTheDocument();
    expect(screen.getByText("+38 points")).toBeInTheDocument();
    expect(screen.getByText("+52 points")).toBeInTheDocument();
    expect(screen.getByText("+41 points")).toBeInTheDocument();
    expect(screen.getByText("+49 points")).toBeInTheDocument();
  });

  it("renders CTA link to /register", () => {
    render(<TestimonialsSection />);
    const cta = screen.getByText("ابدأ دلوقتي");
    expect(cta.closest("a")).toHaveAttribute("href", "/register");
  });

  it("renders carousel with 5 slides", () => {
    render(<TestimonialsSection />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getAllByTestId("carousel-slide")).toHaveLength(5);
  });

  it("renders GeometricPattern decoration", () => {
    render(<TestimonialsSection />);
    expect(screen.getByTestId("geo-pattern")).toBeInTheDocument();
  });

  it("renders 25 stars across all testimonials", () => {
    const { container } = render(<TestimonialsSection />);
    const stars = container.querySelectorAll(".fill-accent-gold");
    expect(stars.length).toBe(25); // 5 cards x 5 stars
  });
});
