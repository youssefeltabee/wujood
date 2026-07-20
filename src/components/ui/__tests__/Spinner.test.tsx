import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../Spinner";

describe("Spinner", () => {
  it("renders an SVG element", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has aria-label 'Loading' for accessibility", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-label")).toBe("Loading");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("size-6");
  });

  it("applies sm size class", () => {
    const { container } = render(<Spinner size="sm" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("size-4");
  });

  it("applies lg size class", () => {
    const { container } = render(<Spinner size="lg" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("size-10");
  });

  it("applies animate-spin class", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("animate-spin");
  });

  it("applies gold accent color", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("text-accent-gold");
  });

  it("renders spinner with circle and path elements", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelector("circle")).toBeInTheDocument();
    expect(svg.querySelector("path")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    const { container } = render(<Spinner className="custom-spinner" />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("class")).toContain("custom-spinner");
  });

  it("has displayName set", () => {
    expect(Spinner.displayName).toBe("Spinner");
  });
});
