import express from "express";
import cors from "cors";
import mapRoutes from "./routes/mapRoutes";

export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/map", mapRoutes);

const PORT = Number(process.env.PORT) || 3001;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
