import puppeteer from "puppeteer";
import { load } from "cheerio";
import { IJavTsunamiSearchData } from "../../../interfaces";

export async function scrapeContent(url: string) {
  let browser;
  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set realistic user agent and viewport
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 768 });

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Get the HTML after JavaScript execution
    const html = await page.content();
    const $ = load(html);

    class MissavGet {
      title: string;
      id: string;
      image: string;
      upload_date: string;
      duration: string;
      tags: string[];
      description: string;
      embed: string;

      constructor() {
        // Title from h1 element - more specific selector
        this.title =
          $("h1.text-base.lg\\:text-lg.text-nord6").first().text().trim() ||
          $("meta[property='og:title']").attr("content") ||
          $("title").text().trim() ||
          "None";

        // ID from URL or extract from current page
        this.id =
          url?.split("/").pop()?.split("#")[0]?.split("?")[0] ||
          $("meta[property='og:url']")
            .attr("content")
            ?.split("/")
            .pop()
            ?.split("#")[0] ||
          "None";

        // Image from meta property or video poster
        this.image =
          $("meta[property='og:image']").attr("content") ||
          $("video[data-poster]").attr("data-poster") ||
          $("video.player").attr("data-poster") ||
          "None";

        // Duration from meta property and convert to readable format
        const durationMeta = $("meta[property='og:video:duration']").attr(
          "content"
        );
        if (durationMeta && !isNaN(parseInt(durationMeta))) {
          const totalSeconds = parseInt(durationMeta);
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          if (hours > 0) {
            this.duration = `${hours}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          } else {
            this.duration = `${minutes}:${seconds.toString().padStart(2, "0")}`;
          }
        } else {
          this.duration = "None";
        }

        // Upload date from meta property with proper formatting
        const releaseDateMeta = $(
          "meta[property='og:video:release_date']"
        ).attr("content");
        if (releaseDateMeta) {
          try {
            const date = new Date(releaseDateMeta);
            this.upload_date = date.toISOString().split("T")[0];
          } catch {
            this.upload_date = releaseDateMeta;
          }
        } else {
          this.upload_date = "None";
        }

        // Tags from genre links - improved selector targeting
        this.tags = [];

        // Look for the specific genre section
        const genreSection = $("div.text-secondary").filter((_, el) => {
          return $(el).text().includes("Genre:");
        });

        genreSection.find("a.text-nord13").each((_, tagEl) => {
          const tagText = $(tagEl).text().trim();
          if (tagText && !this.tags.includes(tagText)) {
            this.tags.push(tagText);
          }
        });

        // Also try to get tags from keywords meta
        const keywords = $("meta[name='keywords']").attr("content");
        if (keywords && this.tags.length === 0) {
          this.tags = keywords
            .split(",")
            .map((k) => k.trim())
            .filter((k) => k);
        }

        // Description from meta description
        this.description =
          $("meta[name='description']").attr("content") ||
          $("meta[property='og:description']").attr("content") ||
          "None";

        // Video embed URL - improved extraction
        this.embed = "None";

        // Try to extract from the eval-decoded content
        const scriptContent = $.html();

        // Look for the actual video source pattern
        const sourcePatterns = [
          /source\s*=\s*['"`]([^'"`]+\.m3u8[^'"`]*)['"`]/i,
          /['"`](https?:\/\/[^'"`]+\.m3u8[^'"`]*)['"`]/i,
          /['"`]([^'"`]*ea2b400d-ac2c-4432-baa4-7a9e2da5b53f[^'"`]*\.m3u8)['"`]/i,
        ];

        for (const pattern of sourcePatterns) {
          const match = scriptContent.match(pattern);
          if (match) {
            this.embed = match[1];
            break;
          }
        }

        // If still not found, try to construct from known patterns
        if (this.embed === "None" && this.id !== "None") {
          // Try to find base URL patterns
          const baseUrlMatch = scriptContent.match(
            /['"`](https?:\/\/[^'"`]+nineyu\.com[^'"`]+)['"`]/i
          );
          if (baseUrlMatch) {
            const baseUrl = baseUrlMatch[1].replace(/\/[^\/]*$/, "");
            this.embed = `${baseUrl}/playlist.m3u8`;
          }
        }
      }
    }

    const missav = new MissavGet();

    // Filter out "None" values from assets
    const assets = [missav.embed, missav.image].filter(
      (asset) => asset && asset !== "None"
    );

    const result: IJavTsunamiSearchData = {
      success: true,
      data: {
        title: missav.title,
        id: missav.id,
        image: missav.image,
        upload_date: missav.upload_date,
        duration: missav.duration,
        tags: missav.tags,
        description: missav.description,
      },
      assets,
      source: url,
    };

    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(`MissAV scraper error: ${e.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
