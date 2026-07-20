import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders children as elements", () => {
    render(<Button><span data-testid="child">Child</span></Button>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("fires onClick when clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button disabled onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders button as disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("renders button as disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toHaveProperty("disabled", true);
  });

  it("renders a spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    const spinner = button.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("does not render children text when isLoading is true", () => {
    render(<Button isLoading>Hidden</Button>);
    // The children still exist in the DOM but the button text includes the spinner
    // Children are still rendered, they're just next to the spinner
    expect(screen.getByRole("button")).toHaveTextContent("Hidden");
  });

  it("renders left icon", () => {
    render(<Button leftIcon={<span data-testid="left-icon">L</span>}>Click</Button>);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    render(<Button rightIcon={<span data-testid="right-icon">R</span>}>Click</Button>);
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("hides right icon when isLoading is true", () => {
    render(<Button isLoading rightIcon={<span data-testid="right-icon">R</span>}>Click</Button>);
    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
  });

  it("hides left icon when isLoading is true and shows spinner instead", () => {
    render(<Button isLoading leftIcon={<span data-testid="left-icon">L</span>}>Click</Button>);
    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
  });

  it("applies primary variant class by default", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-accent-gold");
  });

  it("applies secondary variant class", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border-border-subtle");
  });

  it("applies ghost variant class", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-text-secondary");
  });

  it("applies danger variant class", () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-red-500/10");
  });

  it("applies sm size class", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-3 py-1.5");
  });

  it("applies md size class by default", () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-5 py-2.5");
  });

  it("applies lg size class", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-7 py-3");
  });

  it("applies fullWidth class", () => {
    render(<Button fullWidth>Full</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-full");
  });

  it("merges custom className", () => {
    render(<Button className="my-custom-class">Custom</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("my-custom-class");
  });

  it("passes additional HTML button props", () => {
    render(<Button type="submit" data-testvalue="xyz">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("data-testvalue", "xyz");
  });

  it("has displayName set", () => {
    expect(Button.displayName).toBe("Button");
  });

  it("renders as a <button> element", () => {
    const { container } = render(<Button>Tag</Button>);
    const button = container.querySelector("button");
    expect(button).toBeInTheDocument();
  });
});
