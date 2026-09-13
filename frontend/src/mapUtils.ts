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
  if (maxNeighborDistance < 0 || Number.isNaN(maxNeighborDistance)) {
    return [];
  }

  const edges: Edge[] = [];
  const connectedPairs = new Set<string>();
  const nodesByX = new Map<number, number[]>();
  const nodesByY = new Map<number, number[]>();

  nodes.forEach((node, index) => {
    const xGroup = nodesByX.get(node.x) ?? [];
    xGroup.push(index);
    nodesByX.set(node.x, xGroup);

    const yGroup = nodesByY.get(node.y) ?? [];
    yGroup.push(index);
    nodesByY.set(node.y, yGroup);
  });

  function addEdges(groups: Map<number, number[]>, coordinate: "x" | "y") {
    for (const indices of groups.values()) {
      const distanceCoordinate = coordinate === "x" ? "y" : "x";
      indices.sort((firstIndex, secondIndex) =>
        nodes[firstIndex][distanceCoordinate] -
          nodes[secondIndex][distanceCoordinate],
      );

      let windowStart = 0;
      for (let current = 0; current < indices.length; current++) {
        const currentIndex = indices[current];
        const currentNode = nodes[currentIndex];
        const currentPosition = coordinate === "x" ? currentNode.y : currentNode.x;

        while (
          windowStart < current &&
          currentPosition -
            (coordinate === "x"
              ? nodes[indices[windowStart]].y
              : nodes[indices[windowStart]].x) >
            maxNeighborDistance
        ) {
          windowStart++;
        }

        for (let previous = windowStart; previous < current; previous++) {
          const previousIndex = indices[previous];
          const pairKey = `${Math.min(previousIndex, currentIndex)}:${Math.max(previousIndex, currentIndex)}`;

          if (!connectedPairs.has(pairKey)) {
            connectedPairs.add(pairKey);
            edges.push({ from: nodes[previousIndex], to: currentNode });
          }
        }
      }
    }
  }

  addEdges(nodesByX, "x");
  addEdges(nodesByY, "y");

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
