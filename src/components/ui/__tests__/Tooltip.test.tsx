import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "../Tooltip";

describe("Tooltip", () => {
  it("renders children", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });

  it("renders tooltip content", () => {
    render(
      <Tooltip content="Helpful info">
        <button>Hover</button>
      </Tooltip>
    );
    expect(screen.getByText("Helpful info")).toBeInTheDocument();
  });

  it("has role='tooltip' on the tooltip element", () => {
    render(
      <Tooltip content="Tooltip">
        <button>Hover</button>
      </Tooltip>
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("tooltip is hidden by default (opacity-0 class)", () => {
    render(
      <Tooltip content="Hidden">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("opacity-0");
  });

  it("tooltip shows on hover (group-hover:opacity-100)", () => {
    render(
      <Tooltip content="Shown on hover">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("group-hover:opacity-100");
  });

  it("has pointer-events-none on tooltip", () => {
    render(
      <Tooltip content="No events">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("pointer-events-none");
  });

  it("applies top position classes by default", () => {
    render(
      <Tooltip content="Top tooltip">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("bottom-full");
    expect(tooltip.className).toContain("left-1/2");
    expect(tooltip.className).toContain("-translate-x-1/2");
  });

  it("applies bottom position classes", () => {
    render(
      <Tooltip content="Bottom" position="bottom">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("top-full");
  });

  it("applies left position classes", () => {
    render(
      <Tooltip content="Left" position="left">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("right-full");
  });

  it("applies right position classes", () => {
    render(
      <Tooltip content="Right" position="right">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("left-full");
  });

  it("applies custom delay as inline style", () => {
    render(
      <Tooltip content="Delayed" delay={500}>
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.style.transitionDelay).toBe("500ms");
  });

  it("applies default delay of 200ms", () => {
    render(
      <Tooltip content="Default delay">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.style.transitionDelay).toBe("200ms");
  });

  it("renders arrow indicator inside tooltip", () => {
    const { container } = render(
      <Tooltip content="With arrow">
        <button>Hover</button>
      </Tooltip>
    );
    const tooltip = screen.getByRole("tooltip");
    const arrow = tooltip.querySelector("span");
    expect(arrow).toBeInTheDocument();
    expect(arrow!.className).toContain("size-0");
  });

  it("merges custom className on wrapper", () => {
    const { container } = render(
      <Tooltip content="Custom" className="custom-tooltip-wrapper">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = container.querySelector("div");
    expect(wrapper!.className).toContain("custom-tooltip-wrapper");
  });

  it("has group class on wrapper for hover interaction", () => {
    const { container } = render(
      <Tooltip content="Group">
        <button>Hover</button>
      </Tooltip>
    );
    const wrapper = container.querySelector("div");
    expect(wrapper!.className).toContain("group");
  });

  it("has displayName set", () => {
    expect(Tooltip.displayName).toBe("Tooltip");
  });
});
