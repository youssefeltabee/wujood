import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "../Toast";

function TestHarness({ message = "Test toast", variant = "info" }: { message?: string; variant?: "info" | "success" | "error" | "warning" }) {
  const { toast } = useToast();
  return <button onClick={() => toast(message, variant)}>Show Toast</button>;
}

function MultiToastHarness() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast("First toast", "info")}>First</button>
      <button onClick={() => toast("Second toast", "success")}>Second</button>
    </div>
  );
}

describe("ToastProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders children", () => {
    render(
      <ToastProvider>
        <p>App content</p>
      </ToastProvider>
    );
    expect(screen.getByText("App content")).toBeInTheDocument();
  });

  it("shows a toast when toast() is called", () => {
    render(
      <ToastProvider>
        <TestHarness message="Hello toast" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Hello toast")).toBeInTheDocument();
  });

  it("toast has role='alert'", () => {
    render(
      <ToastProvider>
        <TestHarness message="Alert toast" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders dismiss button for each toast", () => {
    render(
      <ToastProvider>
        <TestHarness message="Dismiss me" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("removes toast when dismiss button is clicked", () => {
    render(
      <ToastProvider>
        <TestHarness message="Remove me" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Remove me")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Dismiss"));
    expect(screen.queryByText("Remove me")).not.toBeInTheDocument();
  });

  it("auto-dismisses toast after default duration (4000ms)", () => {
    render(
      <ToastProvider>
        <TestHarness message="Auto dismiss" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    expect(screen.getByText("Auto dismiss")).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(4000); });
    expect(screen.queryByText("Auto dismiss")).not.toBeInTheDocument();
  });

  it("does not auto-dismiss before duration elapses", () => {
    render(
      <ToastProvider>
        <TestHarness message="Still here" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.getByText("Still here")).toBeInTheDocument();
  });

  it("renders multiple toasts", () => {
    render(
      <ToastProvider>
        <MultiToastHarness />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("First"));
    fireEvent.click(screen.getByText("Second"));
    expect(screen.getByText("First toast")).toBeInTheDocument();
    expect(screen.getByText("Second toast")).toBeInTheDocument();
  });

  it("removes only the dismissed toast when multiple are shown", () => {
    render(
      <ToastProvider>
        <MultiToastHarness />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("First"));
    fireEvent.click(screen.getByText("Second"));
    const dismissButtons = screen.getAllByLabelText("Dismiss");
    fireEvent.click(dismissButtons[1]);
    expect(screen.getByText("First toast")).toBeInTheDocument();
    expect(screen.queryByText("Second toast")).not.toBeInTheDocument();
  });

  it("renders toast container with aria-live='polite'", () => {
    const { container } = render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>
    );
    const liveRegion = container.querySelector("[aria-live='polite']");
    expect(liveRegion).toBeInTheDocument();
  });

  it("has pointer-events-none on toast container", () => {
    const { container } = render(
      <ToastProvider>
        <TestHarness />
      </ToastProvider>
    );
    const liveRegion = container.querySelector("[aria-live='polite']");
    expect(liveRegion!.className).toContain("pointer-events-none");
  });

  it("renders SVG icon for each toast", () => {
    render(
      <ToastProvider>
        <TestHarness message="Icon test" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    const alert = screen.getByRole("alert");
    expect(alert.querySelector("svg")).toBeInTheDocument();
  });

  it("throws error when useToast is used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestHarness />)).toThrow(
      "useToast must be used within a ToastProvider"
    );
    consoleSpy.mockRestore();
  });
});

describe("Toast variant styling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("applies info variant styling by default", () => {
    render(
      <ToastProvider>
        <TestHarness message="Info toast" variant="info" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-accent-cyan/15");
  });

  it("applies success variant styling", () => {
    render(
      <ToastProvider>
        <TestHarness message="Success toast" variant="success" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-score-high/15");
  });

  it("applies error variant styling", () => {
    render(
      <ToastProvider>
        <TestHarness message="Error toast" variant="error" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-score-low/15");
  });

  it("applies warning variant styling", () => {
    render(
      <ToastProvider>
        <TestHarness message="Warning toast" variant="warning" />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Show Toast"));
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-score-mid/15");
  });
});
