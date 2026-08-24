import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "../HeroSection";

vi.mock("next/link", () => ({ default: vi.fn(({ children, href, className }) => <a href={href} className={className}>{children}</a>) }));
vi.mock("next/dynamic", () => ({ default: () => { const D = ({ children }: { children: React.ReactNode }) => <>{children}</>; D.displayName = "DynamicComponent"; return D; } }));
vi.mock("@/components/ui/Logo", () => ({ Logo: () => <div data-testid="logo" /> }));
vi.mock("@/components/audit/AuditForm", () => ({ AuditForm: () => <div data-testid="audit-form" /> }));
vi.mock("@/components/hero/ThreeScene", () => ({ ThreeScene: ({ children }: { children: React.ReactNode }) => <div data-testid="three-scene">{children}</div> }));
vi.mock("@/components/hero/ScoreOrb", () => ({ ScoreOrb: () => <div data-testid="score-orb" /> }));
vi.mock("@/lib/i18n", () => ({
  useLocale: () => ({
    locale: "en", setLocale: vi.fn(), dir: "ltr",
    t: (key: string) => ({ "hero.heading":"Your customers are searching for you on WhatsApp right now.","hero.subtext":"If your website is outdated or your social media went quiet","hero.badge.free":"Free • 30s Audit","hero.badge.whatsapp":"WhatsApp Included","nav.login":"Login","nav.cta":"Start Now","hero.feature.whatsapp":"WhatsApp click-to-chat","hero.feature.mobile":"Mobile-friendly site","hero.feature.social":"Social media setup" }[key] ?? key),
  }),
}));

afterEach(() => vi.clearAllMocks());

describe("HeroSection", () => {
  it("renders the main headline", () => {
    render(<HeroSection />);
    expect(screen.getByText("Your customers are searching for you on WhatsApp right now.")).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    const { container } = render(<HeroSection />);
    const p = screen.getByText(/If your website is outdated or your social media went quiet/);
    expect(p).toHaveClass("text-text-secondary");
    expect(container.querySelector("p.animate-rise-3")).toBeInTheDocument();
  });

  it("renders feature badges", () => {
    render(<HeroSection />);
    expect(screen.getByText("Free • 30s Audit")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Included")).toBeInTheDocument();
  });

  it("renders AuditForm within max-width container", () => {
    const { container } = render(<HeroSection />);
    // Hero's conversion path is the embedded AuditForm, not Login/CTA links (those live in Navigation)
    const wrapper = container.querySelector(".max-w-md");
    expect(wrapper).not.toBeNull();
    expect(wrapper!.querySelector('[data-testid="audit-form"]')).toBeInTheDocument();
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

  it("renders desktop orb glow rings", () => {
    const { container } = render(<HeroSection />);
    // Logo lives in Navigation; hero decorates the ScoreOrb with pulse/spin rings
    expect(container.querySelector(".animate-pulse-ring")).toBeInTheDocument();
    expect(container.querySelector(".animate-spin-slow")).toBeInTheDocument();
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
