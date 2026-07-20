import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SmoothScroll } from "../SmoothScroll";

describe("SmoothScroll", () => {
  it("renders children inside the Lenis provider", () => {
    render(
      <SmoothScroll>
        <span data-testid="child">Content</span>
      </SmoothScroll>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Content");
  });

  it("passes root prop as true to Lenis", () => {
    const { container } = render(
      <SmoothScroll>
        <div>Content</div>
      </SmoothScroll>
    );
    const lenisEl = container.querySelector("[data-lenis-root]");
    expect(lenisEl).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <SmoothScroll>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
        <span data-testid="c">C</span>
      </SmoothScroll>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
    expect(screen.getByTestId("c")).toBeInTheDocument();
  });

  it("renders with no children gracefully", () => {
    const { container } = render(<SmoothScroll />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders plain text children", () => {
    render(<SmoothScroll>Hello World</SmoothScroll>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
