import { load } from "cheerio";
import { IJavTsunamiSearchData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class JavTusamiGet {
      title: string;
      id: string;
      image: string;
      upload_date: string;
      duration: string;
      tags: string[];
      description: string;
      embed: string;

      constructor() {
        this.title =
          $("div.title-block.box-shadow").find("h1.entry-title").text() ||
          "None";
        this.id = url?.split("/").at(3) || "None";
        this.image = $("div.desc ").find("img").attr("data-lazy-src") || "None";
        const isoDuration = $("meta[itemprop=duration]").attr("content") || "";
        this.duration =
          (isoDuration.match(/(\d+)H/)?.[1] || "0") +
          "h " +
          (isoDuration.match(/(\d+)M/)?.[1] || "0") +
          "m " +
          (isoDuration.match(/(\d+)S/)?.[1] || "0") +
          "s";

        const rawDate = $("meta[itemprop=uploadDate]").attr("content") || "";
        this.upload_date = rawDate
          ? new Date(rawDate).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "None";
        this.tags =
          $("div.tags-list a")
            .map((_, el) => $(el).attr("title"))
            .get() || [];
        this.description =
          $("div.desc").find("p").eq(1).text().trim() || "None";
        this.embed = $("meta[itemprop=embedURL]").attr("content") || "None";
      }
    }

    const jt = new JavTusamiGet();
    const result: IJavTsunamiSearchData = {
      success: true,
      data: {
        title: jt.title,
        id: jt.id,
        image: jt.image,
        upload_date: jt.upload_date,
        duration: jt.duration,
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
