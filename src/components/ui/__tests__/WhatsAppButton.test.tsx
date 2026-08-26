import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppButton } from "../WhatsAppButton";

// Mock next/link
vi.mock("next/link", () => ({
  default: vi.fn(({ children, href, target, rel, className, "aria-label": ariaLabel }) => (
    <a href={href} target={target} rel={rel} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )),
}));

const ENV = process.env;

describe("WhatsAppButton", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ENV };
  });

  afterEach(() => {
    process.env = ENV;
  });

  it("renders nothing when NEXT_PUBLIC_WHATSAPP_NUMBER is unset", () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const { container } = render(<WhatsAppButton />);
    expect(container.querySelector("a")).not.toBeInTheDocument();
  });

  it("renders a link with the configured number", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "201001234567";
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://wa.me/201001234567");
  });

  it("opens in a new tab with safe rel", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "201001234567";
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has aria-label 'Chat on WhatsApp'", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "201001234567";
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Chat on WhatsApp");
  });

  it("renders WhatsApp SVG icon with fixed positioning", () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "201001234567";
    const { container } = render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("fixed");
    expect(link.className).toContain("bottom-6");
    expect(link.className).toContain("z-50");
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });
});
