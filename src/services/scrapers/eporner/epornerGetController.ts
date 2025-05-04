import { load } from "cheerio";
import { IEpornerVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class EpornerGet {
      title: string;
      link: string;
      image: string;
      views: string;
      duration: string;
      upvote: string;
      downvote: string;
      embed: string;
      video: {
        download: string;
      }[];
      related_videos: {
        title: string;
        image: string;
        views: string;
        duration: string;
        url: string;
      }[];

      constructor() {
        this.title =
          $("#video-info")
            .find("h1")
            .clone()
            .children("span")
            .remove()
            .end()
            .text()
            .trim() || "None";
        this.link = $("link[rel='canonical']").attr("href") || "None";
        this.image = $("#EPvideo").attr("poster") || "None";
        this.views = $("#cinemaviews1").text() || "None";
        this.duration = $("span.vid-length").text() || "None";
        this.upvote = $("div.likeup").find("i").text() || "None";
        this.downvote = $("div.likedown").find("i").text() || "None";
        this.embed =
          $($.parseHTML($("#embedCodeText").text())).attr("src") || "None";
        this.video = $("div.dloaddivcol")
          .find("span.download-h264")
          .map((i, el) => {
            return {
              download: `${c.EPORNER}${$(el).find("a").attr("href")}` || "None",
            };
          })
          .get(); // Added .get() to convert the map to an array
        this.related_videos = $("#relateddiv")
          .find("div.mb")
          .map((i, el) => {
            return {
              title: $(el).find("p.mbtit").find("a").text() || "None",
              image: $(el).find("img").attr("data-src") || "None",
              views:
                $(el).find("p.mbstats").find("span.mbvie").text() || "None",
              duration:
              
                $(el).find("p.mbstats").find("span.mbtim").text() || "None",
              url: `${c.SPANKBANG}${$(el).find("a").attr("href")}` || "None",
            };
          })
          .get();
      }
    }

    const ep = new EpornerGet();
    const result: IEpornerVideoData = {
      success: true,
      data: {
        title: ep.title,
        link: ep.link,
        image: ep.image,
        views: ep.views,
        duration: ep.duration,
        upvote: ep.upvote,
        downvote: ep.downvote,
      },
      related_videos: ep.related_videos,
      assets: [ep.embed, ...ep.video.map((v) => v.download), ep.image],
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
