import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

vi.mock("next/link", () => ({ default: vi.fn(({ children, href, className }) => <a href={href} className={className}>{children}</a>) }));
vi.mock("next/dynamic", () => ({ default: () => { const D = ({ children }: { children: React.ReactNode }) => <>{children}</>; D.displayName = "DynamicComponent"; return D; } }));
vi.mock("@/components/ui/Logo", () => ({ Logo: () => <div data-testid="logo" /> }));
vi.mock("@/components/audit/AuditForm", () => ({ AuditForm: () => <div data-testid="audit-form" /> }));
vi.mock("@/components/hero/ThreeScene", () => ({ ThreeScene: ({ children }: { children: React.ReactNode }) => <div data-testid="three-scene">{children}</div> }));
vi.mock("@/components/hero/ScoreOrb", () => ({ ScoreOrb: () => <div data-testid="score-orb" /> }));

afterEach(() => vi.clearAllMocks());

describe("HeroSection", () => {
  it("renders the main headline", () => {
    render(<HeroSection />);
    expect(screen.getByText("Your customers are searching for you on WhatsApp right now.")).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    render(<HeroSection />);
    expect(screen.getByText(/If your website is outdated or your social media went quiet/)).toBeInTheDocument();
    expect(screen.getByText(/From 1,250 EGP a month/)).toBeInTheDocument();
  });

  it("renders feature badges", () => {
    render(<HeroSection />);
    expect(screen.getByText("Free — 30 seconds")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Included")).toBeInTheDocument();
  });

  it("renders Login and CTA links with correct hrefs", () => {
    render(<HeroSection />);
    const login = screen.getByText("Login");
    expect(login.closest("a")).toHaveAttribute("href", "/login");

    const cta = screen.getByText("ابدأ دلوقتي");
    expect(cta.closest("a")).toHaveAttribute("href", "/register");
  });

  it("renders all three feature check items", () => {
    render(<HeroSection />);
    expect(screen.getByText("WhatsApp click-to-chat")).toBeInTheDocument();
    expect(screen.getByText("Mobile-friendly site")).toBeInTheDocument();
    expect(screen.getByText("Social media setup")).toBeInTheDocument();
  });

  it("renders AuditForm component", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("audit-form")).toBeInTheDocument();
  });

  it("renders Logo", () => {
    render(<HeroSection />);
    expect(screen.getByTestId("logo")).toBeInTheDocument();
  });

  it("renders ScoreOrb inside ThreeScene for desktop", () => {
    render(<HeroSection />);
    // ScoreOrb renders inside a dynamically loaded ThreeScene (ssr:false)
    expect(screen.getByTestId("score-orb")).toBeInTheDocument();
  });

  it("renders check icon SVGs for feature list", () => {
    const { container } = render(<HeroSection />);
    const featureSection = container.querySelector(".flex-wrap");
    const svgs = featureSection?.querySelectorAll("svg");
    expect(svgs?.length).toBe(3);
  });

  it("has correct responsive padding classes on section", () => {
    const { container } = render(<HeroSection />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("pb-24");
    expect(section).toHaveClass("md:pb-32");
    expect(section).toHaveClass("overflow-hidden");
  });

  it("has blob background decoration elements", () => {
    const { container } = render(<HeroSection />);
    const blobs = container.querySelectorAll(".animate-blob, .animate-blob-2");
    expect(blobs.length).toBe(2);
  });
});
