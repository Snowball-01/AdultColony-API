import { Router } from "express";
import cors from "cors";
import { slow, limiter } from "../utils/limit-option";

import { getXhamster } from "../controllers/xhamster/xhamsterGet";
import { searchXhamster } from "../controllers/xhamster/xhamsterSearch";

import { getPornhub } from "../controllers/pornhub/pornhubGet";
import { searchPornhub } from "../controllers/pornhub/pornhubSearch";
import { randomPornhub } from "../controllers/pornhub/pornhubRandom";

import { searchSpankBang } from "../controllers/spankbang/spankbangSearch";
import { getSpankbang } from "../controllers/spankbang/spankbangGet";

import { getXnxx } from "../controllers/xnxx/xnxxGet";
import { searchXnxx } from "../controllers/xnxx/xnxxSearch";

import { getXvideos } from "../controllers/xvideos/xvideosGet";
import { searchXvideos } from "../controllers/xvideos/xvideosSearch";

import { getEporner } from "../controllers/eporner/epornerGet";
import { searchEporner } from "../controllers/eporner/epornerSearch";

import { getXasiat } from "../controllers/xasiat/xasiatGet";
import { searchXasiat } from "../controllers/xasiat/xasiatSearch";

import { getJavhdToday } from "../controllers/javhdtoday/javhdtodayGet";
import { searchJavhdToday } from "../controllers/javhdtoday/javhdtodaySearch";

import { getJavTsunami } from "../controllers/javtsunami/javtsunamiGet";
import { searchJavTsunami } from "../controllers/javtsunami/javtsunamiSearch";

import { getJavGiga } from "../controllers/javgiga/javgigaGet";
import { searchJavGiga } from "../controllers/javgiga/javgigaSearch";

import { getHentaiCity } from "../controllers/hentaicity/hentaicityGet";
import { searchHentaiCity } from "../controllers/hentaicity/hentaicitySearch";

import { getHentaifox } from "../controllers/hentaifox/hentaifoxGet";
import { searchHentaifox } from "../controllers/hentaifox/hentaifoxSearch";
import { randomHentaifox } from "../controllers/hentaifox/hentaifoxRandom";

import { getMissav } from "../controllers/missav/missavGet";
import { searchMissav } from "../controllers/missav/missavSearch";

/**
 * @swagger
 * tags:
 *   - name: Xhamster
 *     description: Operations related to Xhamster
 *   - name: Pornhub
 *     description: Operations related to Pornhub
 *   - name: SpankBang
 *     description: Operations related to SpankBang
 *   - name: XNXX
 *     description: Operations related to XNXX
 *   - name: XVideos
 *     description: Operations related to XVideos
 *   - name: Eporner
 *     description: Operations related to Eporner
 *   - name: HentaiFox
 *     description: Operations related to HentaiFox
 *   - name: HentaiCity
 *     description: Operations related to HentaiCity
 *   - name: XAsiat
 *     description: Operations related to XAsiat
 *   - name: JavHDToday
 *     description: Operations related to JavHDToday
 *   - name: JavTsunami
 *     description: Operations related to JavTsunami
 *   - name: JavGiga
 *     description: Operations related to JavGiga
 *   - name: MissAv
 *     description: Operations related to MissAv
 */

/**
 * @swagger
 * /xhamster/get:
 *   get:
 *     summary: Get content from Xhamster
 *     tags: [Xhamster]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xhamster/search:
 *   get:
 *     summary: Search content on Xhamster
 *     tags: [Xhamster]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /pornhub/get:
 *   get:
 *     summary: Get content from Pornhub
 *     tags: [Pornhub]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /pornhub/search:
 *   get:
 *     summary: Search content on Pornhub
 *     tags: [Pornhub]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /pornhub/random:
 *   get:
 *     summary: Get random content from Pornhub
 *     tags: [Pornhub]
 *     responses:
 *       200:
 *         description: Successfully retrieved random content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /spankbang/get:
 *   get:
 *     summary: Get content from SpankBang
 *     tags: [SpankBang]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /spankbang/search:
 *   get:
 *     summary: Search content on SpankBang
 *     tags: [SpankBang]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xnxx/get:
 *   get:
 *     summary: Get content from XNXX
 *     tags: [XNXX]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xnxx/search:
 *   get:
 *     summary: Search content on XNXX
 *     tags: [XNXX]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xvideos/get:
 *   get:
 *     summary: Get content from XVideos
 *     tags: [XVideos]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xvideos/search:
 *   get:
 *     summary: Search content on XVideos
 *     tags: [XVideos]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /eporner/get:
 *   get:
 *     summary: Get content from Eporner
 *     tags: [Eporner]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /eporner/search:
 *   get:
 *     summary: Search content on Eporner
 *     tags: [Eporner]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xasiat/get:
 *   get:
 *     summary: Get content from XAsiat
 *     tags: [XAsiat]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /xasiat/search:
 *   get:
 *     summary: Search content on XAsiat
 *     tags: [XAsiat]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /missav/get:
 *   get:
 *     summary: Get content from MissAv
 *     tags: [MissAv]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /missav/search:
 *   get:
 *     summary: Search content on MissAv
 *     tags: [MissAv]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /javhdtoday/get:
 *   get:
 *     summary: Get content from JavHDToday
 *     tags: [JavHDToday]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /javhdtoday/search:
 *   get:
 *     summary: Search content on JavHDToday
 *     tags: [JavHDToday]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /javtsunami/get:
 *   get:
 *     summary: Get content from JavTsunami
 *     tags: [JavTsunami]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /javtsunami/search:
 *   get:
 *     summary: Search content on JavTsunami
 *     tags: [JavTsunami]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /javgiga/get:
 *   get:
 *     summary: Get content from JavGiga
 *     tags: [JavGiga]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /javgiga/search:
 *   get:
 *     summary: Search content on JavGiga
 *     tags: [JavGiga]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /hentaicity/get:
 *   get:
 *     summary: Get content from HentaiCity
 *     tags: [HentaiCity]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /hentaicity/search:
 *   get:
 *     summary: Search content on HentaiCity
 *     tags: [HentaiCity]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /hentaifox/get:
 *   get:
 *     summary: Get content from HentaiFox
 *     tags: [HentaiFox]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the content to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /hentaifox/search:
 *   get:
 *     summary: Search content on HentaiFox
 *     tags: [HentaiFox]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /hentaifox/random:
 *   get:
 *     summary: Get random content from HentaiFox
 *     tags: [HentaiFox]
 *     responses:
 *       200:
 *         description: Successfully retrieved random content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DetailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         data:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Title of the content
 *             duration:
 *               type: string
 *               description: Duration of the content
 *             thumbnail:
 *               type: string
 *               description: URL of the thumbnail
 *             source:
 *               type: string
 *               description: Source website
 *             streams:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     description: URL of the stream
 *                   quality:
 *                     type: string
 *                     description: Quality of the stream
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: Tags associated with the content
 *     SearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the content
 *               url:
 *                 type: string
 *                 description: URL of the content
 *               duration:
 *                 type: string
 *                 description: Duration of the content
 *               thumbnail:
 *                 type: string
 *                 description: URL of the thumbnail
 *               source:
 *                 type: string
 *                 description: Source website
 *         pagination:
 *           type: object
 *           properties:
 *             totalPages:
 *               type: integer
 *               description: Total number of pages
 *             currentPage:
 *               type: integer
 *               description: Current page number
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful (false in this case)
 *         message:
 *           type: string
 *           description: Error message
 */

function scrapeRoutes() {
  const router = Router();

  router.get("/xhamster/get", cors(), slow, limiter, getXhamster);
  router.get("/xhamster/search", cors(), slow, limiter, searchXhamster);
  router.get("/pornhub/get", cors(), slow, limiter, getPornhub);
  router.get("/pornhub/search", cors(), slow, limiter, searchPornhub);
  router.get("/pornhub/random", cors(), slow, limiter, randomPornhub);
  router.get("/spankbang/search", cors(), slow, limiter, searchSpankBang);
  router.get("/spankbang/get", cors(), slow, limiter, getSpankbang);
  router.get("/xnxx/get", cors(), slow, limiter, getXnxx);
  router.get("/xnxx/search", cors(), slow, limiter, searchXnxx);
  router.get("/xvideos/get", cors(), slow, limiter, getXvideos);
  router.get("/xvideos/search", cors(), slow, limiter, searchXvideos);
  router.get("/eporner/get", cors(), slow, limiter, getEporner);
  router.get("/eporner/search", cors(), slow, limiter, searchEporner);
  router.get("/hentaifox/get", cors(), slow, limiter, getHentaifox);
  router.get("/hentaifox/search", cors(), slow, limiter, searchHentaifox);
  router.get("/hentaifox/random", cors(), slow, limiter, randomHentaifox);
  router.get("/hentaicity/get", cors(), slow, limiter, getHentaiCity);
  router.get("/hentaicity/search", cors(), slow, limiter, searchHentaiCity);
  router.get("/xasiat/get", cors(), slow, limiter, getXasiat);
  router.get("/xasiat/search", cors(), slow, limiter, searchXasiat);
  router.get("/javhdtoday/get", cors(), slow, limiter, getJavhdToday);
  router.get("/javhdtoday/search", cors(), slow, limiter, searchJavhdToday);
  router.get("/javtsunami/get", cors(), slow, limiter, getJavTsunami);
  router.get("/javtsunami/search", cors(), slow, limiter, searchJavTsunami);
  router.get("/javgiga/get", cors(), slow, limiter, getJavGiga);
  router.get("/javgiga/search", cors(), slow, limiter, searchJavGiga);
  router.get("/missav/get", cors(), slow, limiter, getMissav);
  router.get("/missav/search", cors(), slow, limiter, searchMissav);

  return router;
}

export default scrapeRoutes;
