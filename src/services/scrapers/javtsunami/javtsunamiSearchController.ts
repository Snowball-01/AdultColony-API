import { load } from "cheerio";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class JavTsunamiSearch {
      search: object[];

      constructor() {
        this.search = $("div")
          .find("article")
          .map((i, el) => {
            return {
              link: `${$(el).find("a").attr("href")}` || "None",
              id:
                $(el).find("a").attr("href")?.replace(`${c.JAVTSUNAMI}/`, "") ||
                "None",
              image:
                $(el)
                  .find("div.post-thumbnail-container img")
                  .attr("data-src") || "None",
              title: $(el).find("header.entry-header span").text() || "None",
              views: $(el).find("span.views").text() || "None",
              duration: $(el).find("span.duration").text().trim() || "None",
            };
          })
          .get();
      }
    }

    const jts = new JavTsunamiSearch();
    if (jts.search.length === 0) throw Error("No result found");
    const data = jts.search as unknown as string[];
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
