// Main screen for loading, editing, and saving the AGV map.
import { useState, useEffect } from "react";
import { MapCanvas } from "./MapCanvas";
import { NodeEditPanel } from "./NodeEditPanel";
import type { MapFile, MapNode } from "../../shared/types";
import "./App.css";

const API_BASE = window.location.port === "5173" ? "http://localhost:3001" : "";

function App() {
  const [nodes, setNodes] = useState<MapNode[]>([]);
  const [maxNeighborDistance, setMaxNeighborDistance] = useState<number>(1500);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMap() {
      try {
        const response = await fetch(`${API_BASE}/api/map`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load map: ${response.status}`);
        }

        const data: MapFile = await response.json();
        setNodes(data.map.nodes);
        setMaxNeighborDistance(data.map.maxNeighborDistance);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load map");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadMap();

    return () => controller.abort();
  }, []);

  const selectedNode = selectedIndex !== null ? nodes[selectedIndex] : null;

  // Keep the node in the same position so the selected index stays valid.
  function handleNodeChange(updatedNode: MapNode) {
    setNodes((current) =>
      current.map((node, index) =>
        index === selectedIndex ? updatedNode : node,
      ),
    );
  }

  async function handleSave() {
    setSaveStatus("Saving...");

    try {
      const response = await fetch(`${API_BASE}/api/map`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ map: { maxNeighborDistance, nodes } }),
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      setSaveStatus("Saved!");
    } catch (err) {
      setSaveStatus(
        `Error: ${err instanceof Error ? err.message : "Failed to save map"}`,
      );
    }
  }

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error loading map: {error}</div>;

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <h1>AGV Map Editor</h1>
        <button onClick={handleSave}>Save</button>
        {saveStatus && <span style={{ marginLeft: 8 }}>{saveStatus}</span>}
        <MapCanvas
          nodes={nodes}
          maxNeighborDistance={maxNeighborDistance}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
        />
      </div>
      {selectedNode && (
        <NodeEditPanel node={selectedNode} onChange={handleNodeChange} />
      )}
    </div>
  );
}

export default App;
