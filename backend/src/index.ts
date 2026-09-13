import express from "express";
import cors from "cors";
import path from "path";
import mapRoutes from "./routes/mapRoutes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/map", mapRoutes);

// Serve the built frontend as static files, and fall back to index.html for
// any non-API route so the app works even after a browser refresh on a
// client-side route. This only matters in the Docker/production setup,
// where one server serves both the API and the built React app on the
// same port. FRONTEND_DIST_DIR lets Docker point at the correct absolute
// path explicitly, since the compiled backend's directory depth differs
// from local dev.
const frontendDist = process.env.FRONTEND_DIST_DIR || path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

const PORT = Number(process.env.PORT) || 3001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
