import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HowItWorks } from "../HowItWorks";

vi.mock("@/hooks/useScrollReveal", () => ({ useScrollReveal: () => ({ ref: { current: null }, visible: true }) }));
vi.mock("@/components/ui/GeometricPattern", () => ({ GeometricPattern: () => <div data-testid="geo-pattern" /> }));

afterEach(() => vi.clearAllMocks());

describe("HowItWorks", () => {
  it("renders section heading", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Three steps to a real online presence.")).toBeInTheDocument();
  });

  it("renders 'How It Works' label", () => {
    render(<HowItWorks />);
    expect(screen.getByText("How It Works")).toBeInTheDocument();
  });

  it("renders all three step numbers", () => {
    render(<HowItWorks />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders all three step titles", () => {
    render(<HowItWorks />);
    expect(screen.getByText("We scan your business")).toBeInTheDocument();
    expect(screen.getByText("You get your score")).toBeInTheDocument();
    expect(screen.getByText("We build what you need")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    render(<HowItWorks />);
    expect(screen.getByText(/Enter your website URL\. Our audit checks 10 categories/)).toBeInTheDocument();
    expect(screen.getByText(/A clear 0-100 Digital Presence Score/)).toBeInTheDocument();
    expect(screen.getByText(/Pick a plan\. We set up your website/)).toBeInTheDocument();
  });

  it("has section id 'how-it-works' for anchor linking", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("#how-it-works");
    expect(section).toBeInTheDocument();
    expect(section!.tagName).toBe("SECTION");
  });

  it("renders GeometricPattern decoration", () => {
    render(<HowItWorks />);
    expect(screen.getByTestId("geo-pattern")).toBeInTheDocument();
  });

  it("has correct responsive padding classes", () => {
    const { container } = render(<HowItWorks />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("py-24");
    expect(section).toHaveClass("md:py-32");
    expect(section).toHaveClass("overflow-hidden");
  });

  it("renders step cards with visible opacity state", () => {
    const { container } = render(<HowItWorks />);
    const stepCards = container.querySelectorAll(".step-card");
    expect(stepCards.length).toBe(3);
    stepCards.forEach((card) => {
      expect(card.className).toContain("opacity-100");
    });
  });

  it("renders border-accent-gold decorative line per step", () => {
    const { container } = render(<HowItWorks />);
    const borders = container.querySelectorAll(".border-l-2");
    expect(borders.length).toBe(3);
  });

  it("has two-column grid layout on desktop", () => {
    const { container } = render(<HowItWorks />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("md:grid-cols-5");
  });
});
