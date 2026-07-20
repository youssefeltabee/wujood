import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";

const defaultOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Select", () => {
  it("renders a select element", () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders all options", () => {
    render(<Select options={defaultOptions} />);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<Select label="Category" options={defaultOptions} />);
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
  });

  it("associates label with select via htmlFor", () => {
    render(<Select label="Category" id="cat-select" options={defaultOptions} />);
    const select = screen.getByLabelText("Category");
    expect(select).toHaveAttribute("id", "cat-select");
  });

  it("renders placeholder option as disabled", () => {
    render(<Select placeholder="Choose one..." options={defaultOptions} />);
    const placeholder = screen.getByText("Choose one...");
    expect(placeholder).toBeInTheDocument();
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const firstOption = select.options[0];
    expect(firstOption.disabled).toBe(true);
    expect(firstOption.value).toBe("");
  });

  it("does not render placeholder when not provided", () => {
    const { container } = render(<Select options={defaultOptions} />);
    // The select should only have the option elements
    const select = container.querySelector("select")!;
    expect(select.options.length).toBe(3);
  });

  it("fires onChange with correct value", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={defaultOptions} onChange={handleChange} />);
    await user.selectOptions(screen.getByRole("combobox"), "option2");
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error message with role='alert'", () => {
    render(<Select options={defaultOptions} error="Please select an option" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Please select an option");
  });

  it("sets aria-invalid on select when error is present", () => {
    render(<Select options={defaultOptions} error="Error" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows required indicator when required is true", () => {
    render(<Select label="Type" options={defaultOptions} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("disables select when disabled prop is true", () => {
    render(<Select options={defaultOptions} disabled />);
    expect(screen.getByRole("combobox")).toHaveProperty("disabled", true);
  });

  it("applies error border class when error is present", () => {
    const { container } = render(<Select options={defaultOptions} error="Error" />);
    expect(container.querySelector("select")!.className).toContain("border-red-500/50");
  });

  it("merges custom className", () => {
    const { container } = render(<Select options={defaultOptions} className="custom-select" />);
    expect(container.querySelector("select")!.className).toContain("custom-select");
  });

  it("renders dropdown chevron icon", () => {
    const { container } = render(<Select options={defaultOptions} />);
    const chevron = container.querySelector("svg");
    expect(chevron).toBeInTheDocument();
  });

  it("has displayName set", () => {
    expect(Select.displayName).toBe("Select");
  });
});
