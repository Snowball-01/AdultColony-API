import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import cors from "cors";
import favicon from "serve-favicon";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";

import pkg from "../package.json";
import AdultColony from "./AdultColony";
import { logger } from "./utils/logger";
import scrapeRoutes from "./routes/endpoint";
import { limiter, slow } from "./utils/limit-option";

dotenv.config();

const app = express();
const adultcolony = new AdultColony();
const theme = new SwaggerTheme();

// Trust proxy (important for correct IP logging behind reverse proxies)
app.set("trust proxy", 1);

// Serve favicon (make sure the file exists in public/)
const faviconPath = path.join(__dirname, "..", "public", "favicon.ico");
if (fs.existsSync(faviconPath)) {
  app.use(favicon(faviconPath));
}

// Enable CORS
app.use(cors({ origin: "*" }));

// Serve static files from public (includes Swagger assets and index.html)
app.use(express.static(path.join(__dirname, "..", "public")));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AdultColony API",
      version: pkg.version,
      description:
        "API for scraping various adult websites.\n\nMade with ❤️ by Snowball",
      contact: {
        name: "Snowball",
        url: "https://t.me/snowball_official",
      },
    },
    tags: [
      { name: "Xhamster" },
      { name: "Pornhub" },
      { name: "SpankBang" },
      { name: "XNXX" },
      { name: "XVideos" },
      { name: "Eporner" },
      { name: "HentaiFox" },
      { name: "HentaiCity" },
      { name: "XAsiat" },
      { name: "JavHDToday" },
      { name: "JavTsunami" },
      { name: "JavGiga" },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/swagger/*.ts", "./src/models/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const swaggerUiOptions = {
  customSiteTitle: "AdultColony API Documentation",
  customCss: `${theme.getBuffer(
    SwaggerThemeNameEnum.DRACULA
  )}\n${fs.readFileSync(
    path.join(__dirname, "..", "public", "swagger-custom.css"),
    "utf8"
  )}`,
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    filter: true,
    displayRequestDuration: true,
    docExpansion: "none",
    defaultModelsExpandDepth: 0,
    defaultModelExpandDepth: 2,
    tryItOutEnabled: true,
    tagsSorter: "alpha",
    operationsSorter: "alpha",
    deepLinking: true,
    syntaxHighlight: { activate: true, theme: "agate" },
    showExtensions: true,
    showCommonExtensions: true,
  },
};

// Swagger UI route
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions)
);

// HTML Dashboard route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get system statistics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Successful response with system statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 playground:
 *                   type: string
 *                 date:
 *                   type: string
 *                 rss:
 *                   type: string
 *                 heap:
 *                   type: string
 *                 server:
 *                   type: object
 *                 version:
 *                   type: string
 */
app.get("/api/stats", slow, limiter, async (req, res) => {
  const systemInfo = {
    success: true,
    playground: `http://adultcolony.site/docs`,
    date: new Date().toLocaleString(),
    rss: adultcolony.currentProccess().rss,
    heap: adultcolony.currentProccess().heap,
    server: await adultcolony.getServer(),
    version: pkg.version,
  };

  res.json(systemInfo);

  logger.info({
    path: req.path,
    method: req.method,
    ip: req.ip,
    useragent: req.get("User-Agent"),
  });
});

// API endpoints
app.use(scrapeRoutes());

// 404 Not Found Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.error({
    path: req.url,
    method: req.method,
    ip: req.ip,
    useragent: req.get("User-Agent"),
  });

  res.status(404).json({
    error: "Page Not Found",
    message: `No route found for ${req.method} ${req.url}`,
  });
});

// Global Error Handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    error: error.message,
    stack: error.stack,
    path: req.url,
    method: req.method,
  });

  res.status(500).json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ ${pkg.name} is running at http://localhost:${PORT}`);
});
