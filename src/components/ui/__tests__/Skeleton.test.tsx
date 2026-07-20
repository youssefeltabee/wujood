import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "../Skeleton";

describe("Skeleton", () => {
  it("renders a <div> element", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("has aria-hidden='true'", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("div")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("div")!.className).toContain("animate-pulse");
  });

  it("applies bg-bg-elevated class", () => {
    const { container } = render(<Skeleton />);
    expect(container.querySelector("div")!.className).toContain("bg-bg-elevated");
  });

  it("applies text variant class by default", () => {
    const { container } = render(<Skeleton />);
    const div = container.querySelector("div")!;
    expect(div.className).toContain("h-4");
    expect(div.className).toContain("w-full");
    expect(div.className).toContain("rounded");
  });

  it("applies circle variant class", () => {
    const { container } = render(<Skeleton variant="circle" />);
    const div = container.querySelector("div")!;
    expect(div.className).toContain("rounded-full");
  });

  it("applies card variant class", () => {
    const { container } = render(<Skeleton variant="card" />);
    const div = container.querySelector("div")!;
    expect(div.className).toContain("h-32");
    expect(div.className).toContain("rounded-xl");
  });

  it("text variant always includes w-full from the variant definition", () => {
    const { container } = render(<Skeleton variant="text" />);
    const div = container.querySelector("div")!;
    // w-full comes from the text variant's class string itself
    expect(div.className).toContain("w-full");
  });

  it("includes custom width class alongside variant classes", () => {
    const { container } = render(<Skeleton className="w-32" />);
    const div = container.querySelector("div")!;
    expect(div.className).toContain("w-32");
  });

  it("includes custom size class alongside variant classes", () => {
    const { container } = render(<Skeleton className="size-12" />);
    const div = container.querySelector("div")!;
    expect(div.className).toContain("size-12");
  });

  it("merges custom className", () => {
    const { container } = render(<Skeleton className="custom-skeleton" />);
    expect(container.querySelector("div")!.className).toContain("custom-skeleton");
  });

  it("has displayName set", () => {
    expect(Skeleton.displayName).toBe("Skeleton");
  });
});
