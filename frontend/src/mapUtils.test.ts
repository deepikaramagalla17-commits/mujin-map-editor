import { describe, it, expect } from "vitest";
import { computeEdges, computeViewBox } from "./mapUtils";

describe("computeEdges", () => {
  it("connects two nodes sharing an axis within maxNeighborDistance", () => {
    const nodes = [
      { x: 1000, y: 1000, code: 1 },
      { x: 1000, y: 1900, code: 2 },
    ];
    expect(computeEdges(nodes, 1500)).toHaveLength(1);
  });

  it("does not connect nodes farther apart than maxNeighborDistance", () => {
    const nodes = [
      { x: 1000, y: 1000, code: 1 },
      { x: 1000, y: 2700, code: 2 },
    ];
    expect(computeEdges(nodes, 1500)).toHaveLength(0);
  });

  it("does not connect nodes that share no axis (no diagonals)", () => {
    const nodes = [
      { x: 1000, y: 1000, code: 1 },
      { x: 1800, y: 1900, code: 2 },
    ];
    expect(computeEdges(nodes, 1500)).toHaveLength(0);
  });

  it("finds neighbours when nodes are not ordered by position", () => {
    const nodes = [
      { x: 1000, y: 2700, code: 1 },
      { x: 1000, y: 1000, code: 2 },
      { x: 1000, y: 1900, code: 3 },
    ];
    expect(computeEdges(nodes, 1000)).toHaveLength(2);
  });

  it("does not duplicate an edge for nodes with identical coordinates", () => {
    const nodes = [
      { x: 1000, y: 1000, code: 1 },
      { x: 1000, y: 1000, code: 2 },
    ];
    expect(computeEdges(nodes, 0)).toHaveLength(1);
  });
});

describe("computeViewBox", () => {
  it("returns a valid view box when there are no nodes", () => {
    expect(computeViewBox([])).toBe("-500 -500 1000 1000");
  });

  it("adds padding around the map nodes", () => {
    const nodes = [
      { x: 100, y: 200, code: 1 },
      { x: 300, y: 500, code: 2 },
    ];

    expect(computeViewBox(nodes, 50)).toBe("50 150 300 400");
  });
});
