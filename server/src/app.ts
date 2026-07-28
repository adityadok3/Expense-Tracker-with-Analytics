import { prisma } from "./config/prisma";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { exec } from "child_process";

app.get("/seed", (_req, res) => {
  exec("npm run prisma:seed", (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }

    res.json({ output: stdout });
  });
});

const app: Express = express();

// Security & Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static Folder for Receipt Uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/debug/categories", async (_req, res) => {
  const categories = await prisma.category.findMany();

  res.json({
    count: categories.length,
    categories,
  });
});

// API Routes
app.use("/api", routes);

// Global Error Handler
app.use(errorHandler);

export default app;
