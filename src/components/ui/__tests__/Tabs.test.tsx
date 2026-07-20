import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "../Tabs";

const sampleTabs = [
  { value: "tab1", label: "First Tab" },
  { value: "tab2", label: "Second Tab" },
  { value: "tab3", label: "Third Tab" },
];

describe("Tabs", () => {
  it("renders all tab labels", () => {
    render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} />
    );
    expect(screen.getByText("First Tab")).toBeInTheDocument();
    expect(screen.getByText("Second Tab")).toBeInTheDocument();
    expect(screen.getByText("Third Tab")).toBeInTheDocument();
  });

  it("renders with role='tablist'", () => {
    const { container } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} />
    );
    expect(container.querySelector('[role="tablist"]')).toBeInTheDocument();
  });

  it("renders each tab as role='tab'", () => {
    render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} />
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
  });

  it("sets aria-selected=true on the active tab", () => {
    render(
      <Tabs tabs={sampleTabs} activeTab="tab2" onTabChange={() => {}} />
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[2]).toHaveAttribute("aria-selected", "false");
  });

  it("calls onTabChange with the tab value when clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={handleChange} />
    );
    await user.click(screen.getByText("Second Tab"));
    expect(handleChange).toHaveBeenCalledWith("tab2");
  });

  it("calls onTabChange for each tab click", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={handleChange} />
    );
    await user.click(screen.getByText("Third Tab"));
    expect(handleChange).toHaveBeenCalledWith("tab3");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("applies active styling to active tab (underline variant default)", () => {
    const { container } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} />
    );
    const tabs = container.querySelectorAll("button");
    expect(tabs[0].className).toContain("text-accent-gold");
    expect(tabs[0].className).toContain("border-accent-gold");
  });

  it("does not apply active styling to inactive tabs", () => {
    const { container } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} />
    );
    const tabs = container.querySelectorAll("button");
    expect(tabs[1].className).not.toContain("text-accent-gold");
    expect(tabs[2].className).not.toContain("border-accent-gold");
  });

  it("applies underline variant list classes by default", () => {
    const { container } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} />
    );
    const tablist = container.querySelector('[role="tablist"]')!;
    expect(tablist.className).toContain("border-b");
    expect(tablist.className).toContain("border-border-subtle");
  });

  it("applies pill variant classes", () => {
    const { container } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} variant="pill" />
    );
    const tablist = container.querySelector('[role="tablist"]')!;
    expect(tablist.className).toContain("bg-bg-surface");
    expect(tablist.className).toContain("rounded-xl");

    const activeTab = container.querySelectorAll("button")[0];
    expect(activeTab.className).toContain("bg-bg-elevated");
    expect(activeTab.className).toContain("shadow-sm");
  });

  it("renders badge when provided", () => {
    const tabsWithBadge = [
      { value: "tab1", label: "Tab 1", badge: <span data-testid="badge-1">3</span> },
      { value: "tab2", label: "Tab 2" },
    ];
    render(
      <Tabs tabs={tabsWithBadge} activeTab="tab1" onTabChange={() => {}} />
    );
    expect(screen.getByTestId("badge-1")).toHaveTextContent("3");
  });

  it("merges custom className on tablist", () => {
    const { container } = render(
      <Tabs tabs={sampleTabs} activeTab="tab1" onTabChange={() => {}} className="custom-tabs" />
    );
    expect(container.querySelector('[role="tablist"]')!.className).toContain("custom-tabs");
  });

  describe("TabPanel", () => {
    it("renders content when value matches activeTab", () => {
      render(
        <Tabs.Panel value="tab1" activeTab="tab1">
          <p>Panel content</p>
        </Tabs.Panel>
      );
      expect(screen.getByText("Panel content")).toBeInTheDocument();
    });

    it("renders nothing when value does not match activeTab", () => {
      render(
        <Tabs.Panel value="tab1" activeTab="tab2">
          <p>Hidden content</p>
        </Tabs.Panel>
      );
      expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    });

    it("has role='tabpanel' when rendered", () => {
      render(
        <Tabs.Panel value="tab1" activeTab="tab1">
          <p>Panel</p>
        </Tabs.Panel>
      );
      expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    });

    it("applies pt-4 class by default", () => {
      const { container } = render(
        <Tabs.Panel value="tab1" activeTab="tab1">
          <p>Panel</p>
        </Tabs.Panel>
      );
      expect(container.querySelector('[role="tabpanel"]')!.className).toContain("pt-4");
    });

    it("merges custom className on tabpanel", () => {
      const { container } = render(
        <Tabs.Panel value="tab1" activeTab="tab1" className="custom-panel">
          <p>Panel</p>
        </Tabs.Panel>
      );
      expect(container.querySelector('[role="tabpanel"]')!.className).toContain("custom-panel");
    });
  });

  it("Tabs.Panel is available as subcomponent", () => {
    expect(Tabs.Panel).toBeDefined();
  });

  it("has displayName set", () => {
    expect(Tabs.displayName).toBe("Tabs");
  });
});
