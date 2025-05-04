import { load } from "cheerio";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class XvideosSearch {
      search: object[];
      constructor() {
        const data = $("div.thumb-under")
          .map((i, el) => {
            return {
              title: $(el).find("a").attr("title"),
              duration: $(el)
                .find("span.bg")
                .find("span.duration")
                .map((i, el) => {
                  return $(el).text();
                })
                .get()[0],
            };
          })
          .get();
        this.search = $("div.mozaique.cust-nb-cols")
          .find("div.thumb")
          .map((i, el) => {
            return {
              link: `${c.XVIDEOS}${$(el).find("a").attr("href")}` || "None",
              id: $(el).find("a").attr("href") || "None",
              image:
                $(el)
                  .find("img")
                  .attr("data-src")
                  ?.replace("thumbs169", "thumbs169lll") || "None",
              title: data[i].title || "None",
              duration:
                data[i].duration === data[i + 1]?.duration
                  ? ""
                  : data[i].duration || "None",
              video: `${c.XVIDEOS}/embedframe/${$(el)
                .find("img")
                .attr("data-videoid")}`,
            };
          })
          .get();

        this.search = this.search.filter((el: any) => {
          return !el.id.includes("THUMBNUM");
        });
        this.search = this.search.filter((el: any) => {
          return el.id.includes("/video");
        });
      }
    }

    const xv = new XvideosSearch();
    if (xv.search.length === 0) throw Error("No result found");
    const data = xv.search as unknown as string[];
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
