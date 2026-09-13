// Shows and edits the currently selected map node.

import type { MapNode, Direction, Charger, Chute } from "../../shared/types";

const ALL_DIRECTIONS: Direction[] = ["North", "South", "East", "West"];

interface NodeEditPanelProps {
  node: MapNode;
  onChange: (newNode: MapNode) => void;
}

export function NodeEditPanel({ node, onChange }: NodeEditPanelProps) {
  const directions = node.directions ?? [];

  // Toggle a direction on the node.
  function toggleDirection(direction: Direction) {
    const isOn = directions.includes(direction);
    const updated = isOn
      ? directions.filter((d) => d !== direction)
      : [...directions, direction];
    onChange({ ...node, directions: updated });
  }

  // Remove the optional field when the charger is turned off.
  function toggleCharger(enabled: boolean) {
    if (enabled) {
      const charger: Charger = { direction: "North" }; // default direction
      onChange({ ...node, charger });
    } else {
      const { charger: _charger, ...rest } = node;
      onChange(rest);
    }
  }

  function toggleChute(enabled: boolean) {
    if (enabled) {
      const chute: Chute = { direction: "North" }; // default direction
      onChange({ ...node, chute });
    } else {
      const { chute: _chute, ...rest } = node;
      onChange(rest);
    }
  }

  return (
    <div style={{ padding: 16, borderLeft: "1px solid #ccc", minWidth: 260 }}>
      <h2>Edit Node</h2>
      <label htmlFor="node-x">
        X:{" "}
        <input
          id="node-x"
          type="number"
          value={node.x}
          onChange={(e) => onChange({ ...node, x: Number(e.target.value) })}
        />
      </label>
      <br />
      <label htmlFor="node-y">
        Y:{" "}
        <input
          id="node-y"
          type="number"
          value={node.y}
          onChange={(e) => onChange({ ...node, y: Number(e.target.value) })}
        />
      </label>
      <br />
      <label htmlFor="node-code">
        Code:{" "}
        <input
          id="node-code"
          type="number"
          value={node.code}
          onChange={(e) => onChange({ ...node, code: Number(e.target.value) })}
        />
      </label>
      <br />
      <fieldset>
        <legend>Directions</legend>
        {ALL_DIRECTIONS.map((direction) => (
          <label key={direction} style={{ display: "block" }}>
            <input
              id={`direction-${direction.toLowerCase()}`}
              type="checkbox"
              checked={directions.includes(direction)}
              onChange={() => toggleDirection(direction)}
            />
            {direction}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Charger</legend>
        <label>
          <input
            id="has-charger"
            type="checkbox"
            checked={!!node.charger}
            onChange={(e) => toggleCharger(e.target.checked)}
          />
          Has Charger
        </label>
        {node.charger && (
          <label htmlFor="charger-direction">
            Direction:{" "}
            <select
              id="charger-direction"
              value={node.charger.direction}
              onChange={(e) =>
                onChange({
                  ...node,
                  charger: { direction: e.target.value as Direction },
                })
              }
            >
              {ALL_DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </label>
        )}
      </fieldset>
      <fieldset>
        <legend>Chute</legend>
        <label>
          <input
            id="has-chute"
            type="checkbox"
            checked={!!node.chute}
            onChange={(e) => toggleChute(e.target.checked)}
          />
          Has Chute
        </label>
        {node.chute && (
          <label htmlFor="chute-direction">
            Direction:{" "}
            <select
              id="chute-direction"
              value={node.chute.direction}
              onChange={(e) =>
                onChange({
                  ...node,
                  chute: { direction: e.target.value as Direction },
                })
              }
            >
              {ALL_DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </label>
        )}
      </fieldset>
    </div>
  );
}
