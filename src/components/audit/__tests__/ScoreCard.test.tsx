import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScoreCard } from "../ScoreCard";

const defaultLabel = { en: "Overall Digital Score", ar: "النتيجة الرقمية الإجمالية" };

describe("ScoreCard", () => {
  it("renders the score value in 'X/100' format", () => {
    render(<ScoreCard score={42} label={defaultLabel} />);
    expect(screen.getByText("42/100")).toBeInTheDocument();
  });

  it("renders label.en text", () => {
    render(<ScoreCard score={50} label={defaultLabel} />);
    expect(screen.getByText("Overall Digital Score")).toBeInTheDocument();
  });

  it("renders label.ar text with rtl direction", () => {
    render(<ScoreCard score={50} label={defaultLabel} />);
    const arLabel = screen.getByText("النتيجة الرقمية الإجمالية");
    expect(arLabel).toBeInTheDocument();
    expect(arLabel).toHaveAttribute("dir", "rtl");
  });

  it("shows 'Ghost' badge for score ≤ 25", () => {
    render(<ScoreCard score={25} label={defaultLabel} />);
    expect(screen.getByText("Ghost")).toBeInTheDocument();
  });

  it("shows 'Faint' badge for score between 26 and 50", () => {
    render(<ScoreCard score={26} label={defaultLabel} />);
    expect(screen.getByText("Faint")).toBeInTheDocument();
  });

  it("shows 'Faint' badge for score exactly 50", () => {
    render(<ScoreCard score={50} label={defaultLabel} />);
    expect(screen.getByText("Faint")).toBeInTheDocument();
  });

  it("shows 'Visible' badge for score between 51 and 75", () => {
    render(<ScoreCard score={75} label={defaultLabel} />);
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("shows 'Present' badge for score above 75", () => {
    render(<ScoreCard score={76} label={defaultLabel} />);
    expect(screen.getByText("Present")).toBeInTheDocument();
  });

  it("shows 'Present' badge for score of 100", () => {
    render(<ScoreCard score={100} label={defaultLabel} />);
    expect(screen.getByText("Present")).toBeInTheDocument();
  });

  it("shows 'Ghost' badge with danger variant for score 0", () => {
    render(<ScoreCard score={0} label={defaultLabel} />);
    expect(screen.getByText("Ghost")).toBeInTheDocument();
  });

  it("applies danger variant badge for Ghost level (score ≤ 25)", () => {
    render(<ScoreCard score={10} label={defaultLabel} />);
    const badge = screen.getByText("Ghost");
    expect(badge.className).toContain("bg-score-low");
  });

  it("applies warning variant badge for Faint level (score 26-50)", () => {
    render(<ScoreCard score={30} label={defaultLabel} />);
    const badge = screen.getByText("Faint");
    expect(badge.className).toContain("bg-score-mid");
  });

  it("applies warning variant badge for Visible level (score 51-75)", () => {
    render(<ScoreCard score={60} label={defaultLabel} />);
    const badge = screen.getByText("Visible");
    expect(badge.className).toContain("bg-score-mid");
  });

  it("applies success variant badge for Present level (score > 75)", () => {
    render(<ScoreCard score={90} label={defaultLabel} />);
    const badge = screen.getByText("Present");
    expect(badge.className).toContain("bg-score-high");
  });

  it("applies correct border color for low score", () => {
    const { container } = render(<ScoreCard score={10} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("border-score-low/30");
  });

  it("applies correct border color for mid-low score", () => {
    const { container } = render(<ScoreCard score={40} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("border-score-midlow/30");
  });

  it("applies correct border color for mid score", () => {
    const { container } = render(<ScoreCard score={60} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("border-score-mid/30");
  });

  it("applies correct border color for high score", () => {
    const { container } = render(<ScoreCard score={90} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("border-score-high/30");
  });

  it("applies correct background color for low score", () => {
    const { container } = render(<ScoreCard score={10} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("bg-score-low/10");
  });

  it("applies correct background color for high score", () => {
    const { container } = render(<ScoreCard score={90} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("bg-score-high/10");
  });

  it("renders text-center class on the card", () => {
    const { container } = render(<ScoreCard score={50} label={defaultLabel} />);
    const card = container.querySelector(".rounded-xl");
    expect(card?.className).toContain("text-center");
  });

  it("renders score in large bold font (text-6xl font-bold)", () => {
    render(<ScoreCard score={50} label={defaultLabel} />);
    const scoreEl = screen.getByText("50/100");
    expect(scoreEl.className).toContain("text-6xl");
    expect(scoreEl.className).toContain("font-bold");
  });
});
