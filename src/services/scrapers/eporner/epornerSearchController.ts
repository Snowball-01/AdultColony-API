import { load } from "cheerio";
import c from "../../../utils/options";
import { ISearchVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const res = await adultcolony.fetchBody(url);
    const $ = load(res);

    class EpornerSearch {
      search: object[];

      constructor() {
        this.search = $("div#vidresults")
          .find("div.mb.hdy")
          .map((i, el) => {
            let imageSrc = $(el).find("div.mbcontent img").attr("src") || "";
            // Check if the image src is the placeholder GIF
            if (
              imageSrc ===
              "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            ) {
              // If it is, fetch the image URL from the data-src attribute
              imageSrc =
                $(el).find("div.mbcontent img").attr("data-src") || "None";
            }
            return {
              link: `${c.EPORNER}${$(el).find("a").attr("href")}` || "None",
              id: $(el).find("a").attr("href")?.replace(c.EPORNER, "") || "None",
              title: $(el).find("p.mbtit a").text() || "None",
              image: imageSrc,
              views: $(el).find("span.mbvie").text() || "None",
              duration: $(el).find("span.mbtim").text() || "None",
              rating: $(el).find("span.mbrate").text() || "None",
            };
          })
          .get();
      }
    }

    const ep = new EpornerSearch();
    if (ep.search.length === 0) throw Error("No result found");
    const data = ep.search as unknown as string[];
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