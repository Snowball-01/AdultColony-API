import { load } from "cheerio";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class XnxxSearch {
      search: object[];
      constructor() {
        this.search = $("div.mozaique > div")
          .map((i, el) => {
            const rawText =
              $(el)
                .find("div.thumb-under")
                .text()
                .split("\n")
                .map((el) => el.trim())
                .filter((el) => el !== "") || [];

            const title = rawText[0] || "";
            const viewsAndRating = rawText[1] || "";
            const duration = rawText[2] || "";

            const [views, rating] = viewsAndRating.split(" ").filter(Boolean);

            return {
              link: `${c.XNXX}${$(el).find("a").attr("href")}`,
              id: $(el).find("a").attr("href")?.slice(1, -1),
              title: title,
              image: $(el)
                .find("img")
                .attr("data-src")
                ?.replace("thumbs169xnxx", "thumbs169xnxxlll"),
              duration: duration,
              views: views || "0",
              rating: rating || "0%",
              video: `${c.XNXX}/embedframe/${$(el)
                .find("img")
                .attr("data-videoid")}`,
            };
          })
          .get();
      }
    }

    const x = new XnxxSearch();
    if (x.search.length === 0) throw Error("No result found");
    const data = x.search as unknown as string[];
    const result: ISearchVideoData = {
      success: true,
      data: data,
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
