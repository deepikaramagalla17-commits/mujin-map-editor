import type { MapFile } from "../../shared/types";
import fs from "fs";
import path from "path";

function getDataFile(): string {
  return process.env.MAP_DATA_FILE || path.join(__dirname, "..", "data", "map.json");
}

export function loadMap(): MapFile {
  const raw = fs.readFileSync(getDataFile(), "utf-8");
  return JSON.parse(raw) as MapFile;
}

export function writeMap(map: MapFile): void {
  const raw = JSON.stringify(map, null, 2);
  fs.writeFileSync(getDataFile(), raw, "utf-8");
}