import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../Badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders children as elements", () => {
    render(<Badge><span data-testid="badge-child">Child</span></Badge>);
    expect(screen.getByTestId("badge-child")).toBeInTheDocument();
  });

  it("renders as a <span> element", () => {
    const { container } = render(<Badge>Span</Badge>);
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  it("applies default variant class by default", () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.querySelector("span")!.className).toContain("bg-bg-elevated");
  });

  it("applies success variant class", () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    expect(container.querySelector("span")!.className).toContain("bg-score-high/10");
  });

  it("applies warning variant class", () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    expect(container.querySelector("span")!.className).toContain("bg-score-mid/10");
  });

  it("applies danger variant class", () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    expect(container.querySelector("span")!.className).toContain("bg-score-low/10");
  });

  it("applies info variant class", () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    expect(container.querySelector("span")!.className).toContain("bg-accent-cyan/10");
  });

  it("applies gold variant class", () => {
    const { container } = render(<Badge variant="gold">Gold</Badge>);
    expect(container.querySelector("span")!.className).toContain("bg-accent-gold/10");
  });

  it("applies md size class by default", () => {
    const { container } = render(<Badge>Medium</Badge>);
    expect(container.querySelector("span")!.className).toContain("text-xs");
  });

  it("applies sm size class", () => {
    const { container } = render(<Badge size="sm">Small</Badge>);
    expect(container.querySelector("span")!.className).toContain("text-[10px]");
  });

  it("applies rounded-full class", () => {
    const { container } = render(<Badge>Rounded</Badge>);
    expect(container.querySelector("span")!.className).toContain("rounded-full");
  });

  it("merges custom className", () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>);
    expect(container.querySelector("span")!.className).toContain("custom-badge");
  });

  it("has displayName set", () => {
    expect(Badge.displayName).toBe("Badge");
  });
});
