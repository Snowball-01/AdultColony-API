import { load } from "cheerio";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class HentaiCitySearch {
      search: object[];

      constructor() {
        this.search = $("div.thumb-list.title-spacing")
          .find("div.outer-item")
          .map((i, el) => {
            const link = $(el).find("a").attr("href") || "None";
            return {
              link: `${link}`,
              id: link.split("/").at(-1) || "None",
              title: $(el).find("p").find("a").attr("title") || "None",
              image: $(el).find("img").attr("src") || "None",
              duration: $(el).find("span.time").text().trim() || "None",
              views:
                $(el).find("div.info").find("span").last().text() || "None",
              rating:
                $(el).find("div.info").find("span").first().text() || "None",
            };
          })
          .get();
      }
    }

    const sb = new HentaiCitySearch();
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
