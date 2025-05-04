import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import pkg from "../package.json";
import AdultColony from "./AdultColony";
import { logger } from "./utils/logger";
import scrapeRoutes from "./routes/endpoint";
import { limiter, slow } from "./utils/limit-option";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import fs from "fs";

dotenv.config();

const app = express();
const adultcolony = new AdultColony();
const theme = new SwaggerTheme();

// Swagger definition
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
      {
        name: "Xhamster",
        description: "Operations related to Xhamster",
      },
      {
        name: "Pornhub",
        description: "Operations related to Pornhub",
      },
      {
        name: "SpankBang",
        description: "Operations related to SpankBang",
      },
      {
        name: "XNXX",
        description: "Operations related to XNXX",
      },
      {
        name: "XVideos",
        description: "Operations related to XVideos",
      },
      {
        name: "Eporner",
        description: "Operations related to Eporner",
      },
      {
        name: "HentaiFox",
        description: "Operations related to HentaiFox",
      },
      {
        name: "HentaiCity",
        description: "Operations related to HentaiCity",
      },
      {
        name: "XAsiat",
        description: "Operations related to XAsiat",
      },
      {
        name: "JavHDToday",
        description: "Operations related to JavHDToday",
      },
      {
        name: "JavTsunami",
        description: "Operations related to JavTsunami",
      },
      {
        name: "JavGiga",
        description: "Operations related to JavGiga",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/swagger/*.ts", "./src/models/*.ts"], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Custom Swagger UI options
const swaggerUiOptions = {
  customSiteTitle: "AdultColony API Documentation",
  customCss: `${theme.getBuffer(
    SwaggerThemeNameEnum.DRACULA
  )}\n${fs.readFileSync(
    path.join(process.cwd(), "public/swagger-custom.css"),
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
    displayOperationId: false,
    showExtensions: true,
    showCommonExtensions: true,
    syntaxHighlight: {
      activate: true,
      theme: "agate",
    },
  },
};

// Serve Swagger UI
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, swaggerUiOptions)
);

// Serve custom JS for Swagger UI
app.use(express.static(path.join(__dirname, "..", "public")));

// Serve favicon.ico
app.use("/favicon.ico", express.static(path.join(__dirname, "..", "public", "favicon.ico")));

// Serve the HTML dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Define API stats in Swagger format
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

// API routes
app.use(scrapeRoutes());

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.error({
    path: req.url,
    method: req.method,
    ip: req.ip,
    useragent: req.get("User-Agent"),
  });
  res.status(404);
  next(
    new Error(`The page not found at path ${req.url} with method ${req.method}`)
  );
});

// Error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${pkg.name} is running on port ${PORT}`);
});
