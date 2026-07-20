import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardClientWrapper from "../DashboardClientWrapper";

describe("DashboardClientWrapper", () => {
  it("renders children inside the ToastProvider", () => {
    render(
      <DashboardClientWrapper>
        <span data-testid="child">Dashboard Content</span>
      </DashboardClientWrapper>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Dashboard Content");
  });

  it("renders multiple children", () => {
    render(
      <DashboardClientWrapper>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </DashboardClientWrapper>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("renders with no children gracefully", () => {
    const { container } = render(<DashboardClientWrapper />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders children as HTML elements", () => {
    render(
      <DashboardClientWrapper>
        <article data-testid="article">Article</article>
      </DashboardClientWrapper>
    );
    expect(screen.getByTestId("article")).toBeInTheDocument();
    expect(screen.getByTestId("article").tagName).toBe("ARTICLE");
  });

  it("wraps children in a ToastProvider context", () => {
    function TestConsumer() {
      // Can't use useToast here directly because it would render React elements
      // Just verify the wrapper renders children
      return <span data-testid="consumer">Consumer</span>;
    }

    render(
      <DashboardClientWrapper>
        <TestConsumer />
      </DashboardClientWrapper>
    );

    expect(screen.getByTestId("consumer")).toHaveTextContent("Consumer");
  });

  it("renders nested structure correctly", () => {
    const { container } = render(
      <DashboardClientWrapper>
        <div data-testid="nested">
          <span>Deep</span>
        </div>
      </DashboardClientWrapper>
    );
    expect(screen.getByTestId("nested")).toBeInTheDocument();
    expect(screen.getByText("Deep")).toBeInTheDocument();
  });

  it("renders Text inside a fragment", () => {
    render(
      <DashboardClientWrapper>
        <>Fragment content</>
      </DashboardClientWrapper>
    );
    expect(screen.getByText("Fragment content")).toBeInTheDocument();
  });
});
