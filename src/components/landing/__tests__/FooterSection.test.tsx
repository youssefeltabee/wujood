import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { FooterSection } from "../FooterSection";

vi.mock("next/link", () => ({ default: vi.fn(({ children, href, className }) => <a href={href} className={className}>{children}</a>) }));
vi.mock("@/components/ui/Logo", () => ({ Logo: () => <div data-testid="logo" /> }));

afterEach(() => vi.clearAllMocks());

describe("FooterSection", () => {
  it("renders Logo", () => {
    render(<FooterSection />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders company description", () => {
    render(<FooterSection />);
    expect(screen.getByText(/Website builder, WhatsApp CRM, social media management/)).toBeInTheDocument();
    expect(screen.getByText(/From 1,250 EGP a month/)).toBeInTheDocument();
  });

  it("renders Quick Links heading", () => {
    render(<FooterSection />);
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
  });

  it("renders all four quick links with correct hrefs", () => {
    render(<FooterSection />);
    const home = screen.getByText("Home");
    expect(home.closest("a")).toHaveAttribute("href", "/");

    const pricing = screen.getByText("Pricing");
    expect(pricing.closest("a")).toHaveAttribute("href", "#pricing");

    const howItWorks = screen.getByText("How It Works");
    expect(howItWorks.closest("a")).toHaveAttribute("href", "#how-it-works");

    const faq = screen.getByText("FAQ");
    expect(faq.closest("a")).toHaveAttribute("href", "#faq");
  });

  it("renders Contact heading", () => {
    render(<FooterSection />);
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("renders contact details", () => {
    render(<FooterSection />);
    expect(screen.getByText("youssefeltabee@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Cairo, Egypt")).toBeInTheDocument();
    expect(screen.getByText("Sun - Thu, 9 AM - 5 PM")).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<FooterSection />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`\u00A9 ${year} Wujood.`)).toBeInTheDocument();
  });

  it("renders Privacy and Terms links", () => {
    render(<FooterSection />);
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(screen.getByText("Terms")).toBeInTheDocument();
  });

  it("has four-column grid layout on desktop", () => {
    const { container } = render(<FooterSection />);
    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("md:grid-cols-4");
  });

  it("renders bottom border separator above copyright", () => {
    const { container } = render(<FooterSection />);
    const separator = container.querySelector(".border-t");
    // Should have at least one border-t (there are two: footer border-t and bottom separator border-t)
    const separators = container.querySelectorAll(".border-t");
    expect(separators.length).toBeGreaterThanOrEqual(2);
  });

  it("has footer element", () => {
    const { container } = render(<FooterSection />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("border-t");
    expect(footer).toHaveClass("border-accent-gold/20");
  });

  it("renders space-y-3 list for quick links", () => {
    const { container } = render(<FooterSection />);
    const lists = container.querySelectorAll(".space-y-3");
    // Quick links list and Contact list both have space-y-3
    expect(lists.length).toBe(2);
  });
});
