import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BlockRenderer, Blocks } from "../blocks";
import { layoutForCategory } from "../templates";
import { DEFAULT_SITE_COLORS } from "../theme";

describe("BlockRenderer safety", () => {
  it("renders nothing for unknown block types", () => {
    const { container } = render(<BlockRenderer block={{ type: "iframe", src: "https://evil.example" }} colors={DEFAULT_SITE_COLORS} />);
    expect(container.innerHTML).toBe("");
  });
  it("drops javascript: URLs on images and CTAs", () => {
    const { container } = render(
      <Blocks
        colors={DEFAULT_SITE_COLORS}
        content={[
          { type: "image", src: "javascript:alert(1)" },
          { type: "cta-button", href: "javascript:alert(1)", label: "x" },
          { type: "cta-button", label: "safe" },
        ]}
      />,
    );
    expect(container.querySelector("img")).toBeNull();
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link.getAttribute("href")).not.toContain("javascript:");
    }
    expect(links[1].getAttribute("href")).toBe("#");
  });
  it("renders paragraph with text", () => {
    const { container } = render(<BlockRenderer block={{ type: "paragraph", text: "hello" }} colors={DEFAULT_SITE_COLORS} />);
    expect(container.textContent).toContain("hello");
  });
  it("skips empty lists", () => {
    const { container } = render(<BlockRenderer block={{ type: "list", items: [] }} colors={DEFAULT_SITE_COLORS} />);
    expect(container.querySelector("ul")).toBeNull();
  });
});

describe("layoutForCategory", () => {
  it("maps seeded template categories", () => {
    expect(layoutForCategory("restaurant")).toBe("bold");
    expect(layoutForCategory("retail")).toBe("bold");
    expect(layoutForCategory("professional")).toBe("classic");
    expect(layoutForCategory("service")).toBe("classic");
  });
  it("falls back to minimal", () => {
    expect(layoutForCategory(null)).toBe("minimal");
    expect(layoutForCategory("unknown-cat")).toBe("minimal");
  });
});
