import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders as a <div> by default", () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.querySelector("div");
    expect(card).toBeInTheDocument();
  });

  it("renders as <section> when as prop is 'section'", () => {
    const { container } = render(<Card as="section">Section</Card>);
    expect(container.querySelector("section")).toBeInTheDocument();
    expect(container.querySelector("div")).not.toBeInTheDocument();
  });

  it("renders as <article> when as prop is 'article'", () => {
    const { container } = render(<Card as="article">Article</Card>);
    expect(container.querySelector("article")).toBeInTheDocument();
  });

  it("renders as <aside> when as prop is 'aside'", () => {
    const { container } = render(<Card as="aside">Aside</Card>);
    expect(container.querySelector("aside")).toBeInTheDocument();
  });

  it("applies elevated variant class by default", () => {
    const { container } = render(<Card>Elevated</Card>);
    expect(container.querySelector("div")!.className).toContain("shadow-lg");
  });

  it("applies surface variant class", () => {
    const { container } = render(<Card variant="surface">Surface</Card>);
    expect(container.querySelector("div")!.className).toContain("bg-bg-elevated");
  });

  it("applies bordered variant class", () => {
    const { container } = render(<Card variant="bordered">Bordered</Card>);
    expect(container.querySelector("div")!.className).toContain("border-border-subtle");
  });

  it("applies interactive variant class", () => {
    const { container } = render(<Card variant="interactive">Interactive</Card>);
    expect(container.querySelector("div")!.className).toContain("cursor-pointer");
  });

  it("applies md padding by default", () => {
    const { container } = render(<Card>Default pad</Card>);
    expect(container.querySelector("div")!.className).toContain("p-6");
  });

  it("applies none padding", () => {
    const { container } = render(<Card padding="none">No pad</Card>);
    expect(container.querySelector("div")!.className).not.toContain("p-");
  });

  it("applies sm padding", () => {
    const { container } = render(<Card padding="sm">Sm pad</Card>);
    expect(container.querySelector("div")!.className).toContain("p-4");
  });

  it("applies lg padding", () => {
    const { container } = render(<Card padding="lg">Lg pad</Card>);
    expect(container.querySelector("div")!.className).toContain("p-8");
  });

  it("merges custom className", () => {
    const { container } = render(<Card className="custom-class">Custom</Card>);
    expect(container.querySelector("div")!.className).toContain("custom-class");
  });

  it("applies rounded-xl class", () => {
    const { container } = render(<Card>Rounded</Card>);
    expect(container.querySelector("div")!.className).toContain("rounded-xl");
  });

  describe("Card.Header", () => {
    it("renders children", () => {
      render(<Card.Header>Header</Card.Header>);
      expect(screen.getByText("Header")).toBeInTheDocument();
    });

    it("applies mb-4 class", () => {
      const { container } = render(<Card.Header>Header</Card.Header>);
      expect(container.querySelector("div")!.className).toContain("mb-4");
    });

    it("merges custom className", () => {
      const { container } = render(<Card.Header className="custom-hdr">Header</Card.Header>);
      expect(container.querySelector("div")!.className).toContain("custom-hdr");
    });
  });

  describe("Card.Body", () => {
    it("renders children", () => {
      render(<Card.Body>Body</Card.Body>);
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      const { container } = render(<Card.Body className="custom-body">Body</Card.Body>);
      expect(container.querySelector("div")!.className).toContain("custom-body");
    });
  });

  describe("Card.Footer", () => {
    it("renders children", () => {
      render(<Card.Footer>Footer</Card.Footer>);
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });

    it("applies mt-4, pt-4, and border classes", () => {
      const { container } = render(<Card.Footer>Footer</Card.Footer>);
      const el = container.querySelector("div")!;
      expect(el.className).toContain("mt-4");
      expect(el.className).toContain("pt-4");
      expect(el.className).toContain("border-t");
      expect(el.className).toContain("border-border-subtle");
    });

    it("merges custom className", () => {
      const { container } = render(<Card.Footer className="custom-ftr">Footer</Card.Footer>);
      expect(container.querySelector("div")!.className).toContain("custom-ftr");
    });
  });

  it("Card.Header, Card.Body, Card.Footer can be composed inside Card", () => {
    render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Content</Card.Body>
        <Card.Footer>Actions</Card.Footer>
      </Card>
    );
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });
});
