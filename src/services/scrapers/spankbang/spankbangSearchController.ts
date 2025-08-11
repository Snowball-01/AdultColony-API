import { load } from "cheerio";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class SpankBangSearch {
      search: object[];

      constructor() {
        this.search = $("div.video-list.video-rotate.with-ads")
          .find("div.video-item")
          .map((i, el) => {
            return {
              link: `${c.SPANKBANG}${$(el).find("a").attr("href")}` || "None",
              id: $(el).find("a").attr("href") || "None",
              title:
                $(el).find("p.line-clamp-2").find("a").attr("title") || "None",
              image: $(el).find("a.thumb img").attr("data-src") || "None",
              duration:
                $(el).find("a span.video-badge.l").text().trim() || "None",
              views:
                $(el)
                  .find("span[data-testid='views']")
                  .find("span")
                  .last()
                  .text()
                  .split(/\s+/)[0] || "None",
              rating:
                $(el)
                  .find("span[data-testid='rates']")
                  .find("span")
                  .last()
                  .text()
                  .split(/\s+/)[0] || "None",
            };
          })
          .get();
      }
    }

    const sb = new SpankBangSearch();
    if (sb.search.length === 0) throw Error("No result found");
    const data = sb.search as unknown as string[];
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
