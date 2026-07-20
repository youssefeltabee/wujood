import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../Input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Input label="Full Name" />);
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(<Input label="Email" id="email-input" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "email-input");
  });

  it("shows required indicator when required is true", () => {
    render(<Input label="Name" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("does not show required indicator when required is false", () => {
    render(<Input label="Name" />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("renders placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("fires onChange when typing", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole("textbox"), "a");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("displays error message with role='alert'", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByRole("alert")).toHaveTextContent("This field is required");
  });

  it("sets aria-invalid on input when error is present", () => {
    render(<Input error="Invalid" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "false");
  });

  it("renders helperText when no error", () => {
    render(<Input helperText="Your full name as on ID" />);
    expect(screen.getByText("Your full name as on ID")).toBeInTheDocument();
  });

  it("hides helperText when error is present", () => {
    render(<Input helperText="Helper" error="Error message" />);
    expect(screen.queryByText("Helper")).not.toBeInTheDocument();
  });

  it("sets aria-describedby for error message", () => {
    render(<Input id="test-id" error="Error text" />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-describedby")).toMatch(/test-id-error/);
  });

  it("sets aria-describedby for helper text", () => {
    render(<Input id="test-id" helperText="Helper text" />);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-describedby")).toMatch(/test-id-helper/);
  });

  it("applies error border classes when error is present", () => {
    const { container } = render(<Input error="Error" />);
    const input = container.querySelector("input")!;
    expect(input.className).toContain("border-red-500/50");
  });

  it("renders left icon when provided", () => {
    render(<Input leftIcon={<span data-testid="left-icon">@</span>} />);
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("applies left padding class when leftIcon is provided", () => {
    const { container } = render(<Input leftIcon={<span>@</span>} />);
    const input = container.querySelector("input")!;
    expect(input.className).toContain("pl-10");
  });

  it("disables input when disabled prop is true", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toHaveProperty("disabled", true);
  });

  it("passes value prop to input", () => {
    render(<Input value="test value" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("test value");
  });

  it("merges custom className", () => {
    const { container } = render(<Input className="custom-input" />);
    expect(container.querySelector("input")!.className).toContain("custom-input");
  });

  it("has displayName set", () => {
    expect(Input.displayName).toBe("Input");
  });
});
