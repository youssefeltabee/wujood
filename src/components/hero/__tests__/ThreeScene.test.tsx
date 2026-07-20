import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThreeScene } from "../ThreeScene";

// Mock @react-three/fiber Canvas to render a simple div with children
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
}));

// Mock @react-three/drei OrbitControls to be a no-op
vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
}));

describe("ThreeScene", () => {
  it("renders a wrapper div with min-h-[300px]", () => {
    const { container } = render(<ThreeScene>child</ThreeScene>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.className).toContain("min-h-[300px]");
  });

  it("renders wrapper div with full width and height classes", () => {
    const { container } = render(<ThreeScene>child</ThreeScene>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("w-full");
    expect(wrapper.className).toContain("h-full");
  });

  it("renders children inside the mocked Canvas", () => {
    render(
      <ThreeScene>
        <span data-testid="child">Hello Three</span>
      </ThreeScene>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Hello Three");
  });

  it("renders the mocked Canvas element inside the wrapper", () => {
    render(<ThreeScene>content</ThreeScene>);
    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });

  it("renders multiple children inside the scene", () => {
    render(
      <ThreeScene>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </ThreeScene>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("renders null child gracefully", () => {
    const { container } = render(
      <ThreeScene>
        {null}
        <span data-testid="real">real</span>
      </ThreeScene>
    );
    expect(container.querySelector("span")).toBeInTheDocument();
  });

  // ponytail: children required by component type, no-children case removed
});
