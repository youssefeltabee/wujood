import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

// Heavy mocks for Three.js — no WebGL in jsdom
vi.mock("three", () => ({
  Mesh: class Mesh {},
  SphereGeometry: class SphereGeometry {},
}));

vi.mock("@react-three/fiber", () => ({
  useFrame: vi.fn(),
}));

import { ScoreOrb } from "../ScoreOrb";

describe("ScoreOrb", () => {
  it("exports a named function component", () => {
    expect(ScoreOrb).toBeDefined();
    expect(typeof ScoreOrb).toBe("function");
  });

  it("renders without throwing in jsdom", () => {
    const { container } = render(<ScoreOrb />);
    // In jsdom, Three.js mesh elements render as unknown custom elements
    // We just verify the component renders without runtime errors
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a mesh element", () => {
    const { container } = render(<ScoreOrb />);
    const mesh = container.querySelector("mesh");
    // mesh is a custom element in jsdom (no WebGL), but the node exists
    expect(mesh).toBeInTheDocument();
  });

  it("mesh has a wireframe material via child elements", () => {
    const { container } = render(<ScoreOrb />);
    const mesh = container.querySelector("mesh");
    const material = mesh?.querySelector("meshStandardMaterial");
    // The material element should exist as a child of mesh
    expect(material).toBeInTheDocument();
  });

  it("mesh contains sphereGeometry child", () => {
    const { container } = render(<ScoreOrb />);
    const mesh = container.querySelector("mesh");
    const geometry = mesh?.querySelector("sphereGeometry");
    expect(geometry).toBeInTheDocument();
  });
});
