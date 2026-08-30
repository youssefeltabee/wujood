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
vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en", setLocale: vi.fn(), dir: "ltr",
    t: (key: string) => ({ "section.testimonials.label":"Real Results","section.testimonials.heading":"Businesses we have helped show up online.","section.testimonials.cta":"Start Now" }[key] ?? key),
  }),
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

  it("renders all placeholder testimonial author names", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("أحمد")).toBeInTheDocument();
    expect(screen.getByText("سارة")).toBeInTheDocument();
  });

  it("renders all placeholder business names", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("مخبز الفجر، حلوان")).toBeInTheDocument();
    expect(screen.getByText("صالون لمسة، المعادي")).toBeInTheDocument();
  });

  it("renders all placeholder testimonial quotes", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText(/التدقيق وضّح لنا مشاكل بسيطة/)).toBeInTheDocument();
    expect(screen.getByText(/كنا ننشر قليل جداً/)).toBeInTheDocument();
  });

  it("renders improvement scores", () => {
    render(<TestimonialsSection />);
    expect(screen.getByText("+42 points")).toBeInTheDocument();
    expect(screen.getByText("+38 points")).toBeInTheDocument();
  });

  it("renders CTA link to /register", () => {
    render(<TestimonialsSection />);
    const cta = screen.getByText("Start Now");
    expect(cta.closest("a")).toHaveAttribute("href", "/register");
  });

  it("renders carousel with all 2 placeholder testimonial slides", () => {
    render(<TestimonialsSection />);
    expect(screen.getByTestId("carousel")).toBeInTheDocument();
    expect(screen.getAllByTestId("carousel-slide")).toHaveLength(2);
  });

  it("renders GeometricPattern decoration", () => {
    render(<TestimonialsSection />);
    expect(screen.getByTestId("geo-pattern")).toBeInTheDocument();
  });

  it("renders 10 stars across all testimonials", () => {
    const { container } = render(<TestimonialsSection />);
    const stars = container.querySelectorAll(".fill-accent-gold");
    expect(stars.length).toBe(10); // 2 cards x 5 stars
  });
});
