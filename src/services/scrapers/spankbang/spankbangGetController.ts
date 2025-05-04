import { load } from "cheerio";
import { ISpankBangVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class SpankBangGet {
      title: string;
      link: string;
      image: string;
      views: string;
      rating: string;
      embed: string;
      video: string;
      related_videos: {
        title: string;
        image: string;
        views: string;
        duration: string;
        url: string;
      }[];

      constructor() {
        this.title = $("h1.main_content_title").text() || "None";
        this.link = $("link[rel='canonical']").attr("href") || "None";
        this.image = $("#player_cover_img").attr("data-src") || "None";
        this.views =
          $("span[data-testid='views']")
            .find("span")
            .last()
            .text()
            .split(/\s+/)[0] || "None";
        this.rating =
          $("span[data-testid='rates']")
            .find("span")
            .last()
            .text()
            .split(/\s+/)[0] || "None";
        this.embed =
          `${c.SPANKBANG}/${this.link.split("/").at(3)}/embed` || "None";
        this.video =
          $("#main_video_player").find("source").attr("src") || "None";
        this.related_videos = $("div.similar")
          .find("div.video-item")
          .map((i, el) => {
            return {
              title:
                $(el).find("span.text-secondary.text-body-md.block").text() ||
                "None",
              image: $(el).find("img").attr("data-src") || "None",
              views:
                $(el)
                  .find("span[data-testid='views']")
                  .find("span")
                  .last()
                  .text() || "None",
              duration:
                $(el).find("span.video-badge.l").text().trim() || "None",
              url: `${c.SPANKBANG}${$(el).find("a").attr("href")}` || "None",
            };
          })
          .get();
      }
    }

    const sb = new SpankBangGet();
    const result: ISpankBangVideoData = {
      success: true,
      data: {
        title: sb.title,
        link: sb.link,
        image: sb.image,
        views: sb.views,
        rating: sb.rating,
      },
      related_videos: sb.related_videos,
      assets: [sb.embed, sb.video, sb.image],
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
