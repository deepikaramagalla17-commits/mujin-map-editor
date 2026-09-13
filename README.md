# AGV Map Editor

A small full-stack map editor for visualising and updating automated guided vehicle (AGV) map data.

The application displays map nodes and their inferred horizontal or vertical connections. A user can select a node, edit its properties, and save the updated map through a REST API. The backend stores the map as JSON, while the frontend provides a lightweight browser-based editing experience.

## What is included

- Interactive SVG map view with clickable, keyboard-accessible nodes
- Automatic connections between nodes that share an X or Y coordinate
- Configurable maximum neighbour distance from the map file
- Node editing for coordinates, code, directions, charger, and chute details
- JSON-backed persistence through the backend API
- Runtime validation of incoming map data before it is written
- Unit tests for map geometry and API behaviour
- Docker setup for serving the built frontend and backend together

## Technology

- **Frontend:** React 19, TypeScript, Vite, Vitest
- **Backend:** Node.js, Express 5, TypeScript, Jest, Supertest
- **Shared model:** TypeScript definitions in `shared/types.ts`
- **Production packaging:** Docker

## Project structure

```text
.
├── backend/
│   ├── data/map.json          # Default map data
│   └── src/
│       ├── index.ts           # Express app and static frontend hosting
│       ├── mapStore.ts        # JSON file persistence
│       └── routes/mapRoutes.ts# Map API and request validation
├── frontend/
│   └── src/
│       ├── App.tsx            # Main editor workflow
│       ├── MapCanvas.tsx      # SVG map rendering
│       ├── NodeEditPanel.tsx  # Selected-node editing controls
│       └── mapUtils.ts        # Edges and view-box calculations
├── shared/types.ts            # Shared map domain types
├── Dockerfile
└── README.md
```

## Running locally

The commands below work from Ubuntu/WSL as well as from a native Windows terminal. Run them from the repository root unless noted otherwise.

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start the backend

In one terminal:

```bash
cd backend
npm run build
npm start
```

The API runs on `http://localhost:3001` by default.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

When the frontend runs on port 5173, it automatically sends API requests to `http://localhost:3001`.

## Docker

A `Dockerfile` is included, built `FROM debian:bullseye` as required. It installs Node.js 20 using the NodeSource Debian distribution (avoiding Debian bullseye's now end-of-life security repo), builds both applications, and runs one Express server that serves the API and the built frontend from a single port.

```bash
docker build -t agv-map-editor .
docker run --rm -p 3001:3001 agv-map-editor
```

**Current status:** The backend Docker build completes successfully. The frontend build is currently blocked by a platform-specific dependency issue in the Vite/Rolldown toolchain. The application runs successfully when the frontend and backend are built locally. A production follow-up would be to pin a compatible Vite/Rollup version or build the frontend separately and copy the generated static files into the image.

The container is configured to persist map data at `/app/backend/data/map.json` through `MAP_DATA_FILE` and serve the frontend from `FRONTEND_DIST_DIR`.

The container uses `/app/backend/data/map.json` for persistence (`MAP_DATA_FILE`) and serves the frontend build from `FRONTEND_DIST_DIR`, both set as environment variables in the Dockerfile.

## API

### `GET /api/map`

Returns the current map.

### `PUT /api/map`

Validates and saves a complete map document. The request body must have this shape:

```json
{
  "map": {
    "maxNeighborDistance": 1500,
    "nodes": [
      {
        "x": 1000,
        "y": 1000,
        "code": 10001000,
        "directions": ["North"],
        "name": "Example node",
        "charger": {
          "direction": "East"
        },
        "chute": {
          "direction": "South"
        }
      }
    ]
  }
}
```

`x`, `y`, `code`, and `maxNeighborDistance` must be finite numbers. Each node must contain those three required fields; the remaining properties are optional.

The API returns `400 Bad Request` for invalid map data and `500 Internal Server Error` if the map cannot be read or written.

## Map rendering behaviour

Connections are calculated on the client from the node coordinates:

- Nodes connect only when they share an X or Y coordinate.
- Diagonal nodes are not connected.
- Connections are included when their distance is less than or equal to `maxNeighborDistance`.
- The SVG view box is calculated from the outermost nodes with padding so the map remains visible as nodes are edited.

## Testing and quality checks

Backend tests cover map loading, saving, and invalid request handling:

```bash
cd backend
npm test
npm run build
```

Frontend geometry tests can be run with Vitest:

```bash
cd frontend
npx vitest run
npm run build
```

The frontend also includes an Oxlint script:

```bash
cd frontend
npm run lint
```

## Design decisions

The editor keeps the map state in the React application and sends a complete map document when saving. This keeps the API simple and makes a save operation atomic from the editor's perspective.

The server performs runtime validation even though TypeScript types are shared with the frontend. TypeScript protects the application during development, while runtime checks protect the JSON API at its actual boundary.

The map is rendered with SVG rather than a canvas so each node remains a native, focusable element. This provides straightforward click and keyboard interaction and keeps the implementation easy to inspect for a small assessment project.

## Possible next steps

For a larger production system, I would consider adding optimistic concurrency protection, a dedicated schema validator such as Zod, undo/redo support, deletion and creation of nodes, more detailed visual indicators for chargers and chutes, and a database or versioned storage layer instead of a single JSON file.
