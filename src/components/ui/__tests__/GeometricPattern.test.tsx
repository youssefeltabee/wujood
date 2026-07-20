import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { GeometricPattern } from "../GeometricPattern";

describe("GeometricPattern", () => {
  it("renders a <div> wrapper", () => {
    const { container } = render(<GeometricPattern />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders an SVG element", () => {
    const { container } = render(<GeometricPattern />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has pointer-events-none class", () => {
    const { container } = render(<GeometricPattern />);
    expect(container.querySelector("div")!.className).toContain("pointer-events-none");
  });

  it("has inset-0 class for absolute positioning", () => {
    const { container } = render(<GeometricPattern />);
    expect(container.querySelector("div")!.className).toContain("inset-0");
  });

  it("applies default opacity of 0.04", () => {
    const { container } = render(<GeometricPattern />);
    const div = container.querySelector("div")!;
    expect(div.style.opacity).toBe("0.04");
  });

  it("applies custom opacity", () => {
    const { container } = render(<GeometricPattern opacity={0.1} />);
    const div = container.querySelector("div")!;
    expect(div.style.opacity).toBe("0.1");
  });

  it("applies custom className", () => {
    const { container } = render(<GeometricPattern className="custom-pattern" />);
    expect(container.querySelector("div")!.className).toContain("custom-pattern");
  });

  it("renders SVG with pattern definition", () => {
    const { container } = render(<GeometricPattern />);
    const svg = container.querySelector("svg")!;
    expect(svg.querySelector("defs")).toBeInTheDocument();
    expect(svg.querySelector("pattern")).toBeInTheDocument();
  });

  it("renders pattern with circles, rects, and lines", () => {
    const { container } = render(<GeometricPattern />);
    const pattern = container.querySelector("pattern")!;
    expect(pattern.querySelector("circle")).toBeInTheDocument();
    expect(pattern.querySelector("rect")).toBeInTheDocument();
    expect(pattern.querySelector("line")).toBeInTheDocument();
  });

  it("pattern has id 'mashrabiya'", () => {
    const { container } = render(<GeometricPattern />);
    const pattern = container.querySelector("pattern")!;
    expect(pattern).toHaveAttribute("id", "mashrabiya");
  });

  it("fills the SVG rect with the pattern", () => {
    const { container } = render(<GeometricPattern />);
    const rect = container.querySelector("svg > rect")!;
    expect(rect).toHaveAttribute("fill", "url(#mashrabiya)");
  });

  it("renders SVG at 100% width and height", () => {
    const { container } = render(<GeometricPattern />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "100%");
    expect(svg).toHaveAttribute("height", "100%");
  });
});
