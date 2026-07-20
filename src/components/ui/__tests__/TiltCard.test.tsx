import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TiltCard } from "../TiltCard";

describe("TiltCard", () => {
  it("renders children", () => {
    render(
      <TiltCard>
        <p>Card content</p>
      </TiltCard>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders as a <div> element", () => {
    const { container } = render(
      <TiltCard>
        <p>Content</p>
      </TiltCard>
    );
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("applies card-tilt class", () => {
    const { container } = render(
      <TiltCard>
        <p>Content</p>
      </TiltCard>
    );
    expect(container.querySelector("div")!.className).toContain("card-tilt");
  });

  it("applies custom className", () => {
    const { container } = render(
      <TiltCard className="custom-card">
        <p>Content</p>
      </TiltCard>
    );
    expect(container.querySelector("div")!.className).toContain("custom-card");
  });

  it("responds to mouseMove event and does not throw when no .card-tilt-inner child exists", () => {
    const { container } = render(
      <TiltCard>
        <p>No tilt inner</p>
      </TiltCard>
    );
    const div = container.querySelector("div")!;
    expect(() => {
      fireEvent.mouseMove(div, { clientX: 100, clientY: 100 });
    }).not.toThrow();
  });

  it("resets transform on mouse leave when .card-tilt-inner exists", () => {
    const { container } = render(
      <TiltCard>
        <div className="card-tilt-inner">Inner</div>
      </TiltCard>
    );
    const div = container.querySelector("div.card-tilt")!;
    const inner = container.querySelector(".card-tilt-inner") as HTMLElement;

    fireEvent.mouseMove(div, { clientX: 0, clientY: 0 });
    fireEvent.mouseLeave(div);
    expect(inner.style.transform).toBe("rotateX(0deg) rotateY(0deg)");
  });

  it("sets --mx and --my CSS custom properties on mousemove", () => {
    const { container } = render(
      <TiltCard>
        <div className="card-tilt-inner">Inner</div>
      </TiltCard>
    );
    const div = container.querySelector("div.card-tilt")!;
    fireEvent.mouseMove(div, { clientX: 200, clientY: 100 });

    const inner = container.querySelector(".card-tilt-inner") as HTMLElement;
    // getBoundingClientRect returns 0x0 in jsdom, so x=0/0=NaN, y=0/0=NaN
    // But --mx and --my will still be set by the code (as NaN%)
    expect(inner.style.getPropertyValue("--mx")).toBeTruthy();
    expect(inner.style.getPropertyValue("--my")).toBeTruthy();
  });

  it("applies custom className via className prop", () => {
    const { container } = render(
      <TiltCard className="my-custom-class">
        <p>Content</p>
      </TiltCard>
    );
    const div = container.querySelector("div")!;
    expect(div.className).toContain("my-custom-class");
  });
});
