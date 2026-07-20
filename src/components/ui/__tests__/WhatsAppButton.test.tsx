import { describe, it, expect, vi } from "vitest";
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

describe("WhatsAppButton", () => {
  it("renders a link element", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
  });

  it("has WhatsApp URL with phone number", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://wa.me/201XXXXXXXXX");
  });

  it("opens in a new tab", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("has rel='noopener noreferrer' for security", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("has aria-label 'Chat on WhatsApp'", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-label", "Chat on WhatsApp");
  });

  it("renders WhatsApp SVG icon", () => {
    const { container } = render(<WhatsAppButton />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });

  it("has fixed positioning classes", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("fixed");
    expect(link.className).toContain("bottom-6");
    expect(link.className).toContain("right-6");
    expect(link.className).toContain("z-50");
  });

  it("has gold background color class", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("bg-accent-gold");
  });

  it("has rounded-full and shadow-lg classes", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("rounded-full");
    expect(link.className).toContain("shadow-lg");
  });

  it("has hover scale transform", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link");
    expect(link.className).toContain("hover:scale-110");
  });
});
