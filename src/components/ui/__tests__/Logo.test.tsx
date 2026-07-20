import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "../Logo";

// Mock next/link
vi.mock("next/link", () => ({
  default: vi.fn(({ children, href }) => <a href={href}>{children}</a>),
}));

describe("Logo", () => {
  it("renders SVG icon", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders wordmark by default", () => {
    render(<Logo />);
    expect(screen.getByText("Wujood")).toBeInTheDocument();
  });

  it("renders Arabic wordmark by default", () => {
    render(<Logo />);
    expect(screen.getByText("وجود")).toBeInTheDocument();
  });

  it("does not render wordmark when showWordmark is false", () => {
    render(<Logo showWordmark={false} />);
    expect(screen.queryByText("Wujood")).not.toBeInTheDocument();
    expect(screen.queryByText("وجود")).not.toBeInTheDocument();
  });

  it("still renders SVG even when wordmark is hidden", () => {
    const { container } = render(<Logo showWordmark={false} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders as a link by default", () => {
    render(<Logo />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders link with custom href", () => {
    render(<Logo href="/dashboard" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("renders without link when href is not provided", () => {
    const { container } = render(<Logo href="" />);
    // When href is empty string, it's falsy so no link rendered
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("has gold accent on Arabic wordmark", () => {
    const { container } = render(<Logo />);
    const arabicSpan = container.querySelector('[dir="rtl"]');
    expect(arabicSpan).toBeInTheDocument();
    expect(arabicSpan!.className).toContain("text-accent-gold");
  });

  it("has bold white text for English wordmark", () => {
    const { container } = render(<Logo />);
    const spans = container.querySelectorAll("span");
    const englishSpan = Array.from(spans).find((s) => s.textContent === "Wujood");
    expect(englishSpan).toBeInTheDocument();
    expect(englishSpan!.className).toContain("font-bold");
    expect(englishSpan!.className).toContain("text-white");
  });

  it("renders SVG with viewBox 0 0 32 32", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox", "0 0 32 32");
  });

  it("has correct SVG dimensions", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "28");
    expect(svg).toHaveAttribute("height", "28");
  });
});
