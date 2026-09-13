import request from "supertest";
import fs from "fs";
import path from "path";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
import { app } from "../index";

const TEST_DATA_FILE = path.join(__dirname, "..", "..", "data", "test-map.json");

beforeAll(() => {
  process.env.MAP_DATA_FILE = TEST_DATA_FILE;
});

afterAll(() => {
  if (fs.existsSync(TEST_DATA_FILE)) {
    fs.unlinkSync(TEST_DATA_FILE);
  }
  delete process.env.MAP_DATA_FILE;
});

beforeEach(() => {
  const seed = {
    map: {
      maxNeighborDistance: 1500,
      nodes: [{ x: 1000, y: 1000, code: 10001000, directions: ["North"] }],
    },
  };
  fs.writeFileSync(TEST_DATA_FILE, JSON.stringify(seed, null, 2), "utf-8");
});

describe("GET /api/map", () => {
  it("returns the current map", async () => {
    const res = await request(app).get("/api/map");
    expect(res.status).toBe(200);
    expect(res.body.map.nodes).toHaveLength(1);
    expect(res.body.map.nodes[0].code).toBe(10001000);
  });
});

describe("PUT /api/map", () => {
  it("saves a valid map and echoes it back", async () => {
    const newMap = {
      map: { maxNeighborDistance: 1500, nodes: [{ x: 5, y: 5, code: 999 }] },
    };
    const res = await request(app).put("/api/map").send(newMap);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(newMap);

    const getRes = await request(app).get("/api/map");
    expect(getRes.body.map.nodes[0].code).toBe(999);
  });

  it("rejects an empty body", async () => {
    const res = await request(app).put("/api/map").send({});
    expect(res.status).toBe(400);
  });

  it("rejects a node missing required fields", async () => {
    const res = await request(app)
      .put("/api/map")
      .send({ map: { maxNeighborDistance: 1500, nodes: [{ x: 1 }] } });
    expect(res.status).toBe(400);
  });
});