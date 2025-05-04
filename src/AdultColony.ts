import pkg from "../package.json";
import p, { IResponse } from "phin";
import http from "http";
import https from "https";

// In-memory cache and deduplication map
const fetchCache = new Map<string, Buffer>();
const inFlightRequests = new Map<string, Promise<Buffer>>();

class AdultColony {
  url: string;
  useragent: string;

  constructor() {
    this.url = "";
    this.useragent = `${pkg.name}/${pkg.version} Node.js/16.9.1`;
  }

  /**
   * Fetch body from url and check if it's cached
   * @param url url to fetch
   * @returns Buffer
   */
  async fetchBody(url: string): Promise<Buffer> {
    url = url.replace(/(?<!:)\/\//g, "/");

    if (fetchCache.has(url)) {
      console.info(`[FetchBody] Cache hit for: ${url}`);
      return fetchCache.get(url)!;
    }

    if (inFlightRequests.has(url)) {
      console.info(`[FetchBody] Awaiting in-flight request for: ${url}`);
      return inFlightRequests.get(url)!;
    }

    const headers = {
      "User-Agent":
        process.env.USER_AGENT ||
        `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36`,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    };

    const agent = url.startsWith("https")
      ? new https.Agent({ keepAlive: true })
      : new http.Agent({ keepAlive: true });

    const maxAttempts = 3;
    let attempt = 0;

    const start = Date.now();

    const fetchPromise = (async () => {
      while (attempt < maxAttempts) {
        try {
          attempt++;

          const response = await p({
            url,
            headers,
            followRedirects: true,
            timeout: 7000,
            parse: "none",
            core: { agent },
          });

          const duration = Date.now() - start;
          console.info(
            `[FetchBody] Success on attempt ${attempt} in ${duration}ms`
          );

          const buffer = response.body as Buffer;
          fetchCache.set(url, buffer);
          return buffer;
        } catch (error) {
          const err = error as Error;
          console.warn(
            `[FetchBody] Attempt ${attempt} failed - ${err.message}`
          );

          if (attempt >= maxAttempts) {
            console.error(`[FetchBody] All ${maxAttempts} attempts failed.`);
            throw new Error(
              `Failed to fetch after ${maxAttempts} attempts: ${err.message}`
            );
          }

          await this.delay(300 * attempt); // Faster backoff
        }
      }

      throw new Error("[FetchBody] Unknown fatal error occurred.");
    })();

    inFlightRequests.set(url, fetchPromise);

    try {
      const result = await fetchPromise;
      return result;
    } finally {
      inFlightRequests.delete(url); // Clean up after completion
    }
  }

  /**
   * Delays execution for a given number of milliseconds.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * remove html tag and bunch of space
   * @param str string to remove html tag
   * @returns string
   */
  removeHtmlTag(str: string): string {
    str = str.replace(/(\r\n|\n|\r)/gm, "");
    str = str.replace(/\s+/g, "");
    return str;
  }

  /**
   * remove html tag without space
   * @param str string to remove html tag
   * @returns string
   */
  removeHtmlTagWithoutSpace(str: string): string {
    str = str.replace(/(\r\n|\n|\r|\t)/gm, "");
    str = str.replace(/\\/g, "");
    str = str.replace(/\s+/g, " ");
    return str.trim();
  }

  /**
   * remove all single quote on array
   * @param arr array to remove single quote
   * @returns string[]
   */
  removeAllSingleQuoteOnArray(arr: string[]): string[] {
    return arr.map((item) => item.replace(/'/g, ""));
  }

  /**
   * time ago converter
   * @param input date to convert
   * @returns string
   */
  timeAgo(input: Date) {
    const date = new Date(input);
    const formatter: any = new Intl.RelativeTimeFormat("en");
    const ranges: { [key: string]: number } = {
      years: 3600 * 24 * 365,
      months: 3600 * 24 * 30,
      weeks: 3600 * 24 * 7,
      days: 3600 * 24,
      hours: 3600,
      minutes: 60,
      seconds: 1,
    };
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    for (const key in ranges) {
      if (ranges[key] < Math.abs(secondsElapsed)) {
        const delta = secondsElapsed / ranges[key];
        return formatter.format(Math.round(delta), key);
      }
    }
  }

  /**
   * convert seconds to minute
   * @param seconds seconds to convert
   * @returns string
   */
  secondToMinute(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${minutes}min, ${second}sec`;
  }

  /**
   * get current process memory usage
   * @returns object
   */
  currentProccess() {
    const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
    arr.reverse();
    const rss = process.memoryUsage().rss / 1024 / 1024;
    const heap = process.memoryUsage().heapUsed / 1024 / 1024;
    const heaptotal = process.memoryUsage().heapTotal / 1024 / 1024;
    return {
      rss: `${Math.round(rss * 100) / 100} MB`,
      heap: `${Math.round(heap * 100) / 100}/${
        Math.round(heaptotal * 100) / 100
      } MB`,
    };
  }

  /**
   * fetch this server location
   * @returns <Promise<string>>
   */
  async getServer(): Promise<string> {
    const raw = (await p({
      url: "http://ip-api.com/json",
      parse: "json",
    })) as IResponse;
    const data = raw.body as unknown as { country: string; regionName: string };
    return `${data.country}, ${data.regionName}`;
  }
}

export default AdultColony;
