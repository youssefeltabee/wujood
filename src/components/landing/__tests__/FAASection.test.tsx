import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FAASection } from "../FAASection";

vi.mock("@/components/ui/ScrollReveal", () => ({
  RevealSection: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
}));

afterEach(() => vi.clearAllMocks());

describe("FAASection", () => {
  it("renders 'FAQ' label", () => {
    render(<FAASection />);
    expect(screen.getByText("FAQ")).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<FAASection />);
    expect(screen.getByText("Common questions.")).toBeInTheDocument();
  });

  it("renders all five FAQ questions", () => {
    render(<FAASection />);
    expect(screen.getByText("Do I need technical skills to use Wujood?")).toBeInTheDocument();
    expect(screen.getByText("Can I cancel anytime?")).toBeInTheDocument();
    expect(screen.getByText("What if I already have a website?")).toBeInTheDocument();
    expect(screen.getByText("Do you work with businesses outside Cairo?")).toBeInTheDocument();
    expect(screen.getByText("Is support available in Arabic?")).toBeInTheDocument();
  });

  it("FAQ answers are present in the DOM", () => {
    render(<FAASection />);
    expect(screen.getByText(/No\. We set everything up for you/)).toBeInTheDocument();
    expect(screen.getByText(/Yes\. No contracts, no early termination fees/)).toBeInTheDocument();
    expect(screen.getByText(/We can work with your existing site or build a new one/)).toBeInTheDocument();
    expect(screen.getByText(/We work with Egyptian businesses everywhere/)).toBeInTheDocument();
    expect(screen.getByText(/Yes\. Our team speaks Arabic and English/)).toBeInTheDocument();
  });

  it("FAQ items use details/summary for expand-collapse", () => {
    const { container } = render(<FAASection />);
    const details = container.querySelectorAll("details");
    expect(details.length).toBe(5);
    const summaries = container.querySelectorAll("summary");
    expect(summaries.length).toBe(5);
  });

  it("FAQ items start collapsed (no open attribute)", () => {
    const { container } = render(<FAASection />);
    const details = container.querySelectorAll("details");
    details.forEach((d) => {
      expect(d.hasAttribute("open")).toBe(false);
    });
  });

  it("toggles open when summary is clicked", () => {
    const { container } = render(<FAASection />);
    const firstDetails = container.querySelector("details")!;
    const summary = firstDetails.querySelector("summary")!;
    expect(firstDetails.hasAttribute("open")).toBe(false);

    fireEvent.click(summary);
    expect(firstDetails.hasAttribute("open")).toBe(true);

    fireEvent.click(summary);
    expect(firstDetails.hasAttribute("open")).toBe(false);
  });

  it("renders ChevronDown icon for each FAQ", () => {
    const { container } = render(<FAASection />);
    const chevrons = container.querySelectorAll(".lucide-chevron-down");
    expect(chevrons.length).toBe(5);
  });

  it("has section id 'faq' for anchor linking", () => {
    const { container } = render(<FAASection />);
    const section = container.querySelector("#faq");
    expect(section).toBeInTheDocument();
    expect(section!.tagName).toBe("SECTION");
  });

  it("has correct responsive padding", () => {
    const { container } = render(<FAASection />);
    const section = container.querySelector("#faq");
    expect(section).toHaveClass("py-20");
    expect(section).toHaveClass("md:py-24");
  });

  it("renders border-bottom separators between FAQ items", () => {
    const { container } = render(<FAASection />);
    const borderedItems = container.querySelectorAll(".border-b");
    expect(borderedItems.length).toBe(5);
  });
});
