import { load } from "cheerio";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class JavGigaSearch {
      search: object[];

      constructor() {
        this.search = $("div.videos-list")
          .find("article")
          .map((i, el) => {
            return {
              link: `${$(el).find("a").attr("href")}` || "None",
              id: $(el).find("a").attr("href")?.split("/").at(3) || "None",
              image:
                $(el).find("div.post-thumbnail img").attr("data-src") || "None",
              title: $(el).find("header.entry-header span").text() || "None",
            };
          })
          .get();
      }
    }

    const jga = new JavGigaSearch();
    if (jga.search.length === 0) throw Error("No result found");
    const data = jga.search as unknown as string[];
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
