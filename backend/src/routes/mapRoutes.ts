import { Router } from "express";
import type { Request, Response } from "express";
import { loadMap, writeMap } from "../mapStore";
import type { MapFile } from "../../../shared/types";

const router = Router();

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export function isValidNode(node: unknown): boolean {
  if (typeof node !== "object" || node === null) {
    return false;
  }

  const n = node as Record<string, unknown>;
  return isFiniteNumber(n.x) && isFiniteNumber(n.y) && isFiniteNumber(n.code);
}

export function isValidMapFile(body: unknown): body is MapFile {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  if (typeof b.map !== "object" || b.map === null) return false;
  const map = b.map as Record<string, unknown>;
  return (
    isFiniteNumber(map.maxNeighborDistance) &&
    Array.isArray(map.nodes) &&
    map.nodes.every(isValidNode)
  );
}

router.get("/", (req: Request, res: Response) => {
  try {
    const map: MapFile = loadMap();
    res.json(map);
  } catch (error) {
    console.error("Error loading map:", error);
    res.status(500).json({ error: "Failed to load map" });
  }
});

router.put("/", (req: Request, res: Response) => {
  const body = req.body;

  if (!isValidMapFile(body)) {
    return res.status(400).json({
      error:
        "Invalid map format: expected { map: { maxNeighborDistance, nodes } } with valid nodes",
    });
  }

  try {
    writeMap(body);
    res.status(200).json(body);
  } catch (error) {
    console.error("Error saving map:", error);
    res.status(500).json({ error: "Failed to save map" });
  }
});

export default router;
