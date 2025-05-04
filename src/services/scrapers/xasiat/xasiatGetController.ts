import { load } from "cheerio";
import { IXasiatVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class XasiantGet {
      link: string;
      id: string;
      title: string;
      image: string;
      duration: any;
      rating: string;
      embed: string;
      related_videos: {
        title: string;
        image: string;
        views: string;
        duration: string;
        url: string;
      }[];

      constructor() {
        this.link = $("link[rel='canonical']").attr("href") || "None";
        this.id = this.link?.split("/").slice(4).join("/") || "None";
        this.title = $("div.headline").find("h1").text() || "None";
        this.image = $("meta[property='og:image']").attr("content") || "None";
        this.rating = $("span.object_rating").text() || "None";
        this.embed =
          `${c.XASIAT}/embed/${this.link.split("/").at(4)}` || "None";

        this.related_videos = $("#list_videos_related_videos_items")
          .find("div.item")
          .map((i, el) => {
            return {
              title: $(el).find("strong.title").text().trim() || "None",
              image: $(el).find("img").attr("data-original") || "None",
              views: $(el).find("div.views").text() || "None",
              duration: $(el).find("div.duration").text() || "None",
              url: $(el).find("a").attr("href") || "None",
            };
          })
          .get();
      }
    }

    const xt = new XasiantGet();
    const data: IXasiatVideoData = {
      success: true,
      data: {
        title: adultcolony.removeHtmlTagWithoutSpace(xt.title),
        id: xt.id,
        image: xt.image,
        duration: adultcolony.secondToMinute(Number(xt.duration)),
        rating: xt.rating,
      },
      related_videos: xt.related_videos,
      assets: [xt.embed, xt.image],
      source: xt.link,
    };
    return data;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
