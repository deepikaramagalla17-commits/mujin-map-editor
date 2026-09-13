// Draws the map and reports the selected node to the parent component.

import type { MapNode } from "../../shared/types";
import { computeEdges, computeViewBox } from "./mapUtils";

interface MapCanvasProps {
  nodes: MapNode[];
  maxNeighborDistance: number;
  selectedIndex: number | null;
  onSelectIndex: (index: number) => void;
}

export function MapCanvas({
  nodes,
  maxNeighborDistance,
  selectedIndex,
  onSelectIndex,
}: MapCanvasProps) {
  const edges = computeEdges(nodes, maxNeighborDistance);
  const viewBox = computeViewBox(nodes);

  return (
    <svg
      viewBox={viewBox}
      style={{
        width: "100%",
        height: "80vh",
        background: "#f5f5f5",
        border: "1px solid #ccc",
      }}
    >
      {/* Draw the edges first so the nodes appear on top. */}
      {edges.map((edge, index) => (
        <line
          key={index}
          x1={edge.from.x}
          y1={edge.from.y}
          x2={edge.to.x}
          y2={edge.to.y}
          stroke="#888"
          strokeWidth={20}
        />
      ))}
      {/* Selection uses the array index because a node's code can be edited. */}
      {nodes.map((node, index) => {
        const isSelected = selectedIndex === index;
        return (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={isSelected ? 120 : 80}
            fill={isSelected ? "#1976d2" : "#333"}
            onClick={() => onSelectIndex(index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelectIndex(index);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Map node ${node.name ?? node.code}`}
            style={{ cursor: "pointer" }}
          />
        );
      })}
    </svg>
  );
}
