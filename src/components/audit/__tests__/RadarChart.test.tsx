import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RadarChart } from "../RadarChart";

// Mock recharts entirely to avoid transitive dep issues with reselect ESM
vi.mock("recharts", () => ({
  ResponsiveContainer: ({
    children,
    width,
    height,
  }: {
    children: React.ReactNode;
    width?: number | string;
    height?: number | string;
  }) => (
    <div
      data-testid="responsive-container"
      style={{ width, height }}
      className="recharts-responsive-container"
    >
      {children}
    </div>
  ),
  RadarChart: ({ children, data }: any) => (
    <svg data-testid="radar-chart" data-data-length={data?.length}>
      {children}
    </svg>
  ),
  PolarGrid: () => <polygon data-testid="polar-grid" />,
  PolarAngleAxis: ({ dataKey }: any) => (
    <g data-testid="polar-angle-axis" data-datakey={dataKey}>
      <text>SEO</text>
      <text>Performance</text>
      <text>Mobile</text>
      <text>Security</text>
      <text>Content</text>
    </g>
  ),
  PolarRadiusAxis: () => <line data-testid="polar-radius-axis" />,
  Radar: ({ dataKey }: any) => (
    <path data-testid="radar-path" data-datakey={dataKey} />
  ),
  Tooltip: () => <g data-testid="tooltip" />,
}));

const sampleData = [
  { category: "SEO", score: 8 },
  { category: "Performance", score: 4 },
  { category: "Mobile", score: 2 },
  { category: "Security", score: 9 },
  { category: "Content", score: 6 },
];

describe("RadarChart", () => {
  it("renders a responsive container wrapper", () => {
    const { container } = render(<RadarChart data={sampleData} />);
    const rc = container.querySelector("[data-testid='responsive-container']");
    expect(rc).toBeInTheDocument();
  });

  it("renders the SVG radar chart element", () => {
    render(<RadarChart data={sampleData} />);
    expect(screen.getByTestId("radar-chart")).toBeInTheDocument();
  });

  it("passes data to the radar chart", () => {
    render(<RadarChart data={sampleData} />);
    const chart = screen.getByTestId("radar-chart");
    expect(chart.getAttribute("data-data-length")).toBe("5");
  });

  it("renders polar grid", () => {
    render(<RadarChart data={sampleData} />);
    expect(screen.getByTestId("polar-grid")).toBeInTheDocument();
  });

  it("renders polar angle axis with category labels", () => {
    render(<RadarChart data={sampleData} />);
    expect(
      screen.getByTestId("polar-angle-axis")
    ).toBeInTheDocument();
  });

  it("renders polar radius axis", () => {
    render(<RadarChart data={sampleData} />);
    expect(screen.getByTestId("polar-radius-axis")).toBeInTheDocument();
  });

  it("renders the radar path", () => {
    render(<RadarChart data={sampleData} />);
    expect(screen.getByTestId("radar-path")).toBeInTheDocument();
  });

  it("renders a tooltip", () => {
    render(<RadarChart data={sampleData} />);
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  it("renders with empty data array without crashing", () => {
    const { container } = render(<RadarChart data={[]} />);
    expect(
      container.querySelector("[data-testid='responsive-container']")
    ).toBeInTheDocument();
  });

  it("sets correct height on responsive container", () => {
    render(<RadarChart data={sampleData} />);
    const rc = screen.getByTestId("responsive-container");
    expect(rc.style.height).toBe("300px");
  });
});
