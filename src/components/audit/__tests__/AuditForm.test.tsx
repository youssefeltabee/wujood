import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuditForm } from "../AuditForm";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("AuditForm", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // --- Rendering ---

  it("renders a form element", () => {
    const { container } = render(<AuditForm />);
    expect(container.querySelector("form")).toBeInTheDocument();
  });

  it("renders URL input with placeholder 'example.com'", () => {
    render(<AuditForm />);
    const input = screen.getByPlaceholderText("example.com");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "url");
  });

  it("renders submit button with 'See Your Score'", () => {
    render(<AuditForm />);
    const btn = screen.getByRole("button", { name: /see your score/i });
    expect(btn).toBeInTheDocument();
  });

  it("marks URL input as required", () => {
    render(<AuditForm />);
    expect(screen.getByPlaceholderText("example.com")).toBeRequired();
  });

  it("has autoComplete and dir attributes on input", () => {
    render(<AuditForm />);
    const input = screen.getByPlaceholderText("example.com");
    expect(input).toHaveAttribute("autocomplete", "url");
    expect(input).toHaveAttribute("dir", "auto");
  });

  // --- Validation ---

  it("shows 'Enter a URL' error when submitting with empty input", async () => {
    const { container } = render(<AuditForm />);
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Enter a URL");
    });
  });

  it("shows validation error for a domain without a dot", async () => {
    const { container } = render(<AuditForm />);
    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "notadomain" } });
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Enter a valid domain (e.g., example.com)"
      );
    });
  });

  it("shows validation error for a domain with invalid short TLD", async () => {
    const { container } = render(<AuditForm />);
    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.c" } });
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Enter a valid domain (e.g., example.com)"
      );
    });
  });

  // --- Successful submission ---

  it("calls router.push with audit ID on successful submission", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audit: { id: "audit-42" } }),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "example.com" }),
      });
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/audit/audit-42");
    });
  });

  it("disables submit button and shows spinner during loading", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockImplementationOnce(() => new Promise(() => {})); // never resolves

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /see your score/i });
      expect(btn).toBeDisabled();
    });
    const btn = screen.getByRole("button", { name: /see your score/i });
    expect(btn.querySelector("svg.animate-spin")).toBeInTheDocument();
  });

  // --- Error responses ---

  it("displays server error message when API returns error", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Domain not found" }),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Domain not found");
    });
  });

  it("displays fallback error message when API returns no error text", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Audit failed");
    });
  });

  it("shows 'Network error' when fetch throws", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockRejectedValueOnce(new Error("Failed to fetch"));

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Network error");
    });
  });

  // --- Edge cases ---

  it("clears previous error when re-submitting with valid data", async () => {
    const { container } = render(<AuditForm />);

    // First submit empty — shows error
    fireEvent.submit(container.querySelector("form")!);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Enter a URL");
    });

    // Now add a valid URL and submit again
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audit: { id: "x" } }),
    });
    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("trims whitespace from submitted URL", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audit: { id: "trimmed" } }),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "  example.com  " } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/audit",
        expect.objectContaining({
          body: JSON.stringify({ url: "example.com" }),
        })
      );
    });
  });

  it("accepts subdomains as valid input", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audit: { id: "sub" } }),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "shop.example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  it("accepts domain with hyphens", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audit: { id: "hyphen" } }),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "my-example-site.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled();
    });
  });

  it("disables button during loading and re-enables after error", async () => {
    const { container } = render(<AuditForm />);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "fail" }),
    });

    const input = screen.getByPlaceholderText("example.com");
    fireEvent.change(input, { target: { value: "example.com" } });
    fireEvent.submit(container.querySelector("form")!);

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});
