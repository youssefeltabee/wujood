import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FAASection } from "../FAASection";

vi.mock("@/components/ui/ScrollReveal", () => ({
  RevealSection: ({ children, className, ...props }: React.ComponentProps<"div">) => <div className={className} {...props}>{children}</div>,
}));
vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en",
    setLocale: vi.fn(),
    dir: "ltr",
    t: (key: string) => {
      const dict: Record<string, string> = {
        "section.faq.label": "FAQ",
        "section.faq.heading": "Common questions.",
        "section.faq.q1": "Do I need technical skills to use Wujood?",
        "section.faq.a1": "No. We set everything up for you. You just tell us what you need and we handle the rest.",
        "section.faq.q2": "Can I cancel anytime?",
        "section.faq.a2": "Yes. No contracts, no early termination fees. You keep what we built.",
        "section.faq.q3": "What if I already have a website?",
        "section.faq.a3": "We can work with your existing site or build a new one. Start with a free audit to see where you stand.",
        "section.faq.q4": "Do you work with businesses outside Cairo?",
        "section.faq.a4": "We work with Egyptian businesses everywhere. Our entire platform is remote.",
        "section.faq.q5": "Is support available in Arabic?",
        "section.faq.a5": "Yes. Our team speaks Arabic and English. Support is included in every plan.",
      };
      return dict[key] ?? key;
    },
  }),
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
    expect(section).toHaveClass("py-[var(--spacing-section)]");
  });

  it("renders border-bottom separators between FAQ items", () => {
    const { container } = render(<FAASection />);
    const borderedItems = container.querySelectorAll(".border-b");
    expect(borderedItems.length).toBe(5);
  });
});
