import { load } from "cheerio";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class XasiantSearch {
      search: any;
      constructor() {
        this.search = $("#list_videos_videos_list_search_result_items")
          .find("div.item")
          .map((i, el) => {
            const link = $(el).find("a").attr("href") || "None";
            return {
              link: `${link}`,
              id: link?.split("/").slice(4).join("/") || "None",
              title: $(el).find("strong.title").text().trim() || "None",
              image: $(el).find("img").attr("data-original") || "None",
              duration: $(el).find("div.duration").text() || "None",
              rating:
                $(el)
                  .find("div.rating")
                  .clone()
                  .children()
                  .remove()
                  .end()
                  .text()
                  .trim() || "None",
              views: $(el).find("div.views").text() || "None",
              video: `${c.XASIAT}/embed/${link?.split("/")[4]}` || "None",
            };
          })
          .get();
      }
    }

    const xa = new XasiantSearch();
    if (xa.search.length === 0) throw Error("No result found");
    const data = xa.search as unknown as string[];
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
