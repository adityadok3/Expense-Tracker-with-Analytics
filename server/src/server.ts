import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { prisma } from "./config/prisma";

const PORT = env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully via Prisma.");

    app.listen(PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`Swagger API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error("Failed to connect to the database: %o", error);
    process.exit(1);
  }
}

startServer();
