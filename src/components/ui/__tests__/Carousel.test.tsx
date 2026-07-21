import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "../Carousel";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

afterEach(() => vi.clearAllMocks());

const slides = [
  <div key="1" data-testid="slide-1">Slide 1</div>,
  <div key="2" data-testid="slide-2">Slide 2</div>,
  <div key="3" data-testid="slide-3">Slide 3</div>,
];

describe("Carousel", () => {
  it("renders all slides", () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByTestId("slide-1")).toBeInTheDocument();
    expect(screen.getByTestId("slide-2")).toBeInTheDocument();
    expect(screen.getByTestId("slide-3")).toBeInTheDocument();
  });

  it("renders with correct aria label", () => {
    render(<Carousel slides={slides} ariaLabel="Testimonials" />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Testimonials");
  });

  it("renders default aria label when not provided", () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-label", "Carousel");
  });

  it("renders previous and next navigation buttons", () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByLabelText("Previous slide")).toBeInTheDocument();
    expect(screen.getByLabelText("Next slide")).toBeInTheDocument();
  });

  it("renders dot indicators for each slide", () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByLabelText("Go to slide 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Go to slide 3")).toBeInTheDocument();
  });

  it("sets first dot as active by default", () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByLabelText("Go to slide 1")).toHaveAttribute("aria-current", "true");
  });

  it("hides controls when controls prop is false", () => {
    render(<Carousel slides={slides} controls={false} />);
    expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument();
  });

  it("hides dot indicators when only one slide", () => {
    render(<Carousel slides={[slides[0]]} />);
    expect(screen.queryByLabelText("Go to slide 1")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Previous slide")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next slide")).not.toBeInTheDocument();
  });

  it("sets aria-roledescription on region", () => {
    render(<Carousel slides={slides} />);
    expect(screen.getByRole("region")).toHaveAttribute("aria-roledescription", "carousel");
  });

  it("sets slide aria-labels", () => {
    render(<Carousel slides={slides} />);
    const slideGroups = screen.getAllByRole("group");
    expect(slideGroups).toHaveLength(3);
    expect(slideGroups[0]).toHaveAttribute("aria-roledescription", "slide");
    expect(slideGroups[0]).toHaveAttribute("aria-label", "1 of 3");
    expect(slideGroups[2]).toHaveAttribute("aria-label", "3 of 3");
  });

  it("respects reduced motion preference", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(<Carousel slides={slides} />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });
});
