import { load } from "cheerio";
import { IJavhdTodaySearchData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class JavhdTodayGet {
      title: string;
      id: string;
      image: string;
      genre: string[];
      release_date: string;
      country: string;
      tags: string[];
      description: string;
      embed: string;

      constructor() {
        this.title =
          $("div.content-container").find("h1").first().text() || "None";
        this.id = url?.split("/").at(3) || "None";
        this.image =
          $("div[style='display: inline-grid;']").find("img").attr("src") ||
          "None";
        // Genre (These are found in the first .col-xs-12.col-sm-6.col-md-8 and represent the genres)
        this.genre =
          $(".col-xs-12.col-sm-6.col-md-8")
            .first()
            .find("a")
            .map(function () {
              return $(this).text().trim();
            })
            .get() || [];

        // Release Date
        this.release_date =
          $(".col-xs-12.col-sm-6.col-md-8")
            .eq(1)
            .text()
            .match(/Release Day:\s*(\d{4}-\d{2}-\d{2})/)?.[1]
            .trim() || "Unknown";

        // Country
        this.country =
          $(".col-xs-12.col-sm-6.col-md-8 a")
            .filter(function () {
              return $(this).attr("href")?.includes("tag/japan-sex") ?? false;
            })
            .text()
            .trim() || "Unknown";

        // Tags (These are in the second .col-xs-12.col-sm-6.col-md-8, following the country info)
        this.tags =
          $(".col-xs-12.col-sm-6.col-md-8")
            .last()
            .find("a")
            .map(function () {
              return $(this).text().trim();
            })
            .get() || [];
        this.description = $(".description").first().text().trim() || "None";
        this.embed = `${c.JAVHDTODAY}/embed/${url.split("/").at(3)}`;
      }
    }

    const jt = new JavhdTodayGet();
    const result: IJavhdTodaySearchData = {
      success: true,
      data: {
        title: jt.title,
        id: jt.id,
        image: jt.image,
        genre: jt.genre,
        release_date: jt.release_date,
        country: jt.country,
        tags: jt.tags,
        description: jt.description,
      },
      assets: [jt.embed, jt.image],
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
