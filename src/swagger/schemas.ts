/**
 * @swagger
 * components:
 *   schemas:
 *     VideoResult:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the video
 *         url:
 *           type: string
 *           description: URL of the video
 *         thumbnail:
 *           type: string
 *           description: Thumbnail URL
 *         duration:
 *           type: string
 *           description: Duration of the video
 *         views:
 *           type: string
 *           description: Number of views
 *         rating:
 *           type: string
 *           description: Rating of the video
 *       example:
 *         title: "Sample Video Title"
 *         url: "https://example.com/video/123"
 *         thumbnail: "https://example.com/thumbs/123.jpg"
 *         duration: "12:34"
 *         views: "1.2M"
 *         rating: "95%"
 * 
 *     SearchResponse:
 *       type: object
 *       properties:
 *         results:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VideoResult'
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: integer
 *               description: Current page number
 *             totalPages:
 *               type: integer
 *               description: Total number of pages
 *       example:
 *         results:
 *           - title: "Sample Video 1"
 *             url: "https://example.com/video/123"
 *             thumbnail: "https://example.com/thumbs/123.jpg"
 *             duration: "12:34"
 *             views: "1.2M"
 *             rating: "95%"
 *           - title: "Sample Video 2"
 *             url: "https://example.com/video/456"
 *             thumbnail: "https://example.com/thumbs/456.jpg"
 *             duration: "9:11"
 *             views: "856K"
 *             rating: "92%"
 *         pagination:
 *           currentPage: 1
 *           totalPages: 10
 * 
 *     DetailResponse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the content
 *         description:
 *           type: string
 *           description: Description of the content
 *         thumbnails:
 *           type: array
 *           items:
 *             type: string
 *           description: List of thumbnail URLs
 *         streams:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               quality:
 *                 type: string
 *               url:
 *                 type: string
 *           description: Available video streams
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Content tags
 *       example:
 *         title: "Sample Content Title"
 *         description: "This is a sample description of the content."
 *         thumbnails: ["https://example.com/thumbs/123-1.jpg", "https://example.com/thumbs/123-2.jpg"]
 *         streams: [
 *           { quality: "720p", url: "https://example.com/stream/123-720p.mp4" },
 *           { quality: "1080p", url: "https://example.com/stream/123-1080p.mp4" }
 *         ]
 *         tags: ["tag1", "tag2", "tag3"]
 * 
 *     SystemInfo:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Operation success status
 *         playground:
 *           type: string
 *           description: API playground URL
 *         date:
 *           type: string
 *           description: Current date and time
 *         rss:
 *           type: object
 *           description: RSS memory usage
 *         heap:
 *           type: object
 *           description: Heap memory usage
 *         server:
 *           type: object
 *           description: Server information
 *         version:
 *           type: string
 *           description: API version
 *       example:
 *         success: true
 *         playground: "https://AdultColonyAPI/docs"
 *         date: "5/4/2025, 12:00:00 PM"
 *         rss: { used: "100MB", total: "500MB" }
 *         heap: { used: "50MB", total: "200MB" }
 *         server: { os: "Linux", arch: "x64", uptime: "1d 2h 30m" }
 *         version: "1.0.0"
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         stack:
 *           type: string
 *           description: Error stack trace (development only)
 *       example:
 *         message: "The page not found at path /unknown with method GET"
 *         stack: "Error: The page not found at path /unknown with method GET..."
 */