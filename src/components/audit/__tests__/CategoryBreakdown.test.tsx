import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryBreakdown } from "../CategoryBreakdown";

const defaultCategories = {
  seo: 8,
  performance: 4,
  mobile: 2,
  security: 9,
};

const defaultLabels = {
  seo: { en: "SEO", ar: "تحسين محركات البحث" },
  performance: { en: "Performance", ar: "الأداء" },
  mobile: { en: "Mobile Friendliness", ar: "توافق الجوال" },
  security: { en: "Security", ar: "الأمان" },
};

const defaultDescriptions = {
  seo: { en: "Well optimized for search engines", ar: "محسّن جيدًا لمحركات البحث" },
  performance: { en: "Average loading speed", ar: "سرعة تحميل متوسطة" },
  mobile: { en: "Not mobile-friendly", ar: "غير متوافق مع الجوال" },
  security: { en: "Excellent security setup", ar: "إعدادات أمان ممتازة" },
};

describe("CategoryBreakdown", () => {
  it("renders all category items with labels", () => {
    render(
      <CategoryBreakdown
        categories={defaultCategories}
        labels={defaultLabels}
        descriptions={defaultDescriptions}
      />
    );
    expect(screen.getByText("SEO")).toBeInTheDocument();
    expect(screen.getByText("Performance")).toBeInTheDocument();
    expect(screen.getByText("Mobile Friendliness")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
  });

  it("renders score badges with /10 format for each category", () => {
    render(
      <CategoryBreakdown
        categories={defaultCategories}
        labels={defaultLabels}
        descriptions={defaultDescriptions}
      />
    );
    expect(screen.getByText("8/10")).toBeInTheDocument();
    expect(screen.getByText("4/10")).toBeInTheDocument();
    expect(screen.getByText("2/10")).toBeInTheDocument();
    expect(screen.getByText("9/10")).toBeInTheDocument();
  });

  it("renders progress bars with correct width percentages", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={defaultCategories}
        labels={defaultLabels}
        descriptions={defaultDescriptions}
      />
    );
    const bars = container.querySelectorAll(".h-full.rounded-full");
    expect(bars).toHaveLength(4);
    expect((bars[0] as HTMLElement).style.width).toBe("80%");
    expect((bars[1] as HTMLElement).style.width).toBe("40%");
    expect((bars[2] as HTMLElement).style.width).toBe("20%");
    expect((bars[3] as HTMLElement).style.width).toBe("90%");
  });

  it("applies correct bar color class for low score (≤3)", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={{ mobile: 2 }}
        labels={{ mobile: { en: "Mobile", ar: "" } }}
        descriptions={{ mobile: { en: "Low", ar: "" } }}
      />
    );
    const bar = container.querySelector(".h-full.rounded-full");
    expect(bar).toHaveClass("bg-score-low");
  });

  it("applies correct bar color class for mid-low score (4-6)", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={{ perf: 4 }}
        labels={{ perf: { en: "Perf", ar: "" } }}
        descriptions={{ perf: { en: "Mid", ar: "" } }}
      />
    );
    const bar = container.querySelector(".h-full.rounded-full");
    expect(bar).toHaveClass("bg-score-midlow");
  });

  it("applies correct bar color class for mid score (7-8)", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={{ seo: 8 }}
        labels={{ seo: { en: "SEO", ar: "" } }}
        descriptions={{ seo: { en: "Good", ar: "" } }}
      />
    );
    const bar = container.querySelector(".h-full.rounded-full");
    expect(bar).toHaveClass("bg-score-mid");
  });

  it("applies correct bar color class for high score (9-10)", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={{ security: 9 }}
        labels={{ security: { en: "Security", ar: "" } }}
        descriptions={{ security: { en: "Great", ar: "" } }}
      />
    );
    const bar = container.querySelector(".h-full.rounded-full");
    expect(bar).toHaveClass("bg-score-high");
  });

  it("applies correct badge variant for danger scores (≤3)", () => {
    render(
      <CategoryBreakdown
        categories={{ mobile: 2 }}
        labels={{ mobile: { en: "Mobile", ar: "" } }}
        descriptions={{ mobile: { en: "Low", ar: "" } }}
      />
    );
    const badge = screen.getByText("2/10");
    expect(badge.className).toContain("bg-score-low");
  });

  it("applies correct badge variant for high scores (9-10)", () => {
    render(
      <CategoryBreakdown
        categories={{ security: 9 }}
        labels={{ security: { en: "Security", ar: "" } }}
        descriptions={{ security: { en: "Great", ar: "" } }}
      />
    );
    const badge = screen.getByText("9/10");
    expect(badge.className).toContain("bg-score-high");
  });

  it("renders description text for each category", () => {
    render(
      <CategoryBreakdown
        categories={defaultCategories}
        labels={defaultLabels}
        descriptions={defaultDescriptions}
      />
    );
    expect(
      screen.getByText("Well optimized for search engines")
    ).toBeInTheDocument();
    expect(screen.getByText("Average loading speed")).toBeInTheDocument();
    expect(screen.getByText("Not mobile-friendly")).toBeInTheDocument();
    expect(
      screen.getByText("Excellent security setup")
    ).toBeInTheDocument();
  });

  it("falls back to category key when label is missing", () => {
    render(
      <CategoryBreakdown
        categories={{ custom_key: 5 }}
        labels={{}}
        descriptions={{}}
      />
    );
    expect(screen.getByText("custom_key")).toBeInTheDocument();
  });

  it("renders empty paragraph when no description provided", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={{ seo: 5 }}
        labels={{ seo: { en: "SEO", ar: "" } }}
        descriptions={{}}
      />
    );
    const paragraphs = container.querySelectorAll("p.text-text-muted");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].textContent).toBe("");
  });

  it("renders each category inside a Card component", () => {
    const { container } = render(
      <CategoryBreakdown
        categories={defaultCategories}
        labels={defaultLabels}
        descriptions={defaultDescriptions}
      />
    );
    const cards = container.querySelectorAll(".rounded-xl");
    expect(cards).toHaveLength(4);
  });

  it("renders empty state when no categories provided", () => {
    const { container } = render(
      <CategoryBreakdown categories={{}} labels={{}} descriptions={{}} />
    );
    const items = container.querySelector(".space-y-4")?.children;
    expect(items?.length).toBe(0);
  });

  it("renders items in the order they appear in the categories object", () => {
    const ordered = { a: 3, b: 7, c: 10 };
    render(
      <CategoryBreakdown
        categories={ordered}
        labels={{
          a: { en: "Alpha", ar: "" },
          b: { en: "Beta", ar: "" },
          c: { en: "Gamma", ar: "" },
        }}
        descriptions={{
          a: { en: "First", ar: "" },
          b: { en: "Second", ar: "" },
          c: { en: "Third", ar: "" },
        }}
      />
    );
    const labels = screen.getAllByText(/Alpha|Beta|Gamma/);
    expect(labels[0]).toHaveTextContent("Alpha");
    expect(labels[1]).toHaveTextContent("Beta");
    expect(labels[2]).toHaveTextContent("Gamma");
  });
});
