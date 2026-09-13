import type { MapNode } from "../../shared/types";

// Shared helpers for finding map edges and calculating the SVG view box.

// A connection between two map nodes.
export interface Edge {
  from: MapNode;
  to: MapNode;
}

// Finds pairs of nodes that are close enough to connect horizontally or vertically.
export function computeEdges(
  nodes: MapNode[],
  maxNeighborDistance: number,
): Edge[] {
  const edges: Edge[] = [];

  // Compare every unique pair of nodes exactly once.
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const sameX = a.x === b.x;
      const sameY = a.y === b.y;

      // Only connect nodes that share an x or y coordinate.
      if (!sameX && !sameY) {
        continue;
      }

      const distance = sameX ? Math.abs(a.y - b.y) : Math.abs(a.x - b.x);

      if (distance <= maxNeighborDistance) {
        edges.push({ from: a, to: b });
      }
    }
  }
  return edges;
}

// Returns an SVG view box with padding around the outermost nodes.

export function computeViewBox(
  nodes: MapNode[],
  padding: number = 500,
): string {
  if (nodes.length === 0) {
    return `${-padding} ${-padding} ${padding * 2} ${padding * 2}`;
  }

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);

  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
}
