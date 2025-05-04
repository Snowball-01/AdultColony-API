import { load } from "cheerio";
import { IJavGigaSearchData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class JavGigaGet {
      title: string;
      id: string;
      image: string;
      upload_date: string;
      code: string;
      duration: string;
      tags: string[];
      description: string;
      embed: string;

      constructor() {
        this.title =
          $("div.title-block.box-shadow").find("h1.entry-title").text() ||
          "None";
        this.id = url?.split("/").at(3) || "None";
        this.image = $("div.desc").find("img").attr("data-src") || "None";
        const descText = $("meta[itemprop=description]").attr("content") || "";
        const codeMatch = descText.match(/ID:\s*([A-Z0-9\-]+)/i);
        const durationMatch = descText.match(/Length:\s*(\d+)\s*min/i);
        this.code = codeMatch ? codeMatch[1].trim() : "None";
        this.duration = durationMatch
          ? `${durationMatch[1].trim()} min`
          : "None";
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

    const jg = new JavGigaGet();
    const result: IJavGigaSearchData = {
      success: true,
      data: {
        title: jg.title,
        id: jg.id,
        image: jg.image,
        upload_date: jg.upload_date,
        code: jg.code,
        duration: jg.duration,
        tags: jg.tags,
        description: jg.description,
      },
      assets: [jg.embed, jg.image],
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
