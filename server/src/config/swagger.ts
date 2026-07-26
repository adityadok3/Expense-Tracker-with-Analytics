import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Expense Tracker with Analytics API",
      version: "1.0.0",
      description: "Comprehensive REST API with JWT Authentication, Expense/Income Tracking, Budgets, Analytics, AI Financial Advisor, and PDF Reporting.",
      contact: {
        name: "Developer",
        email: "alex@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
