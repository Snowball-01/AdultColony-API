import { load } from "cheerio";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class JavhdTodaySearch {
      search: object[];

      constructor() {
        this.search = $("ul.videos")
          .find("li")
          .map((i, el) => {
            return {
              link: `${c.JAVHDTODAY}${$(el).find("a").attr("href")}` || "None",
              id: $(el).find("a").attr("href")?.replace(/^\/+/, "") || "None",
              code:
                $(el)
                  .find("span.video-overlay1.badge.transparent")
                  .text()
                  .trim() || "None",
              image: $(el).find("div.video-thumb img").attr("src") || "None",
              title: $(el).find("span.video-title").text() || "None",
              duration:
                $(el)
                  .find("span.video-overlay.badge.transparent")
                  .text()
                  .replace("HD ", "")
                  .trim() || "None",
              uploaded_on:
                $(el).find("span.video-overlay2.badge1.transparent1").text() ||
                "None",
            };
          })
          .get();
      }
    }

    const jht = new JavhdTodaySearch();
    if (jht.search.length === 0) throw Error("No result found");
    const data = jht.search as unknown as string[];
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
