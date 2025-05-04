import { load } from "cheerio";
import { IXhamsterVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class XhamsterGet {
      link: string;
      id: string;
      title: string;
      image: string;
      duration: any;
      views: string;
      rating: string;
      publish: string;
      upVote: string;
      downVote: string;
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
        this.link = $("link[rel='canonical']").attr("href") || "None";
        this.id =
          this.link.split("/")[3] + "/" + this.link.split("/")[4] || "None";
        this.title = $("meta[property='og:title']").attr("content") || "None";
        this.image = $("meta[property='og:image']").attr("content") || "None";
        this.duration = $("script#initials-script").html() || "None";
        //remove window.initials={ and };
        this.duration = this.duration.replace("window.initials=", "");
        this.duration = this.duration.replace(/;/g, "");
        this.duration = JSON.parse(this.duration);
        this.duration = this.duration.videoModel.duration || "None";
        this.views = $("p.primary-8643e").find("span").first().text() || "None";
        this.rating =
          $("p.primary-8643e").find("span.primary-8643e").last().text() ||
          "None";
        this.publish =
          $("div.entity-info-container__date").attr("data-tooltip") || "None";
        this.upVote =
          $("div.rb-new__info").text().split("/")[0].trim() || "None";
        this.downVote =
          $("div.rb-new__info").text().split("/")[1].trim() || "None";
        this.embed =
          "https://xheve2.com/embed/" + this.link.split("-").pop() || "None";

        this.video =
          $("a.player-container__no-player.xplayer").attr("href") || "None";

        this.related_videos = $("div[data-ecommerce-list-name='related']")
          .find("div[data-role='related-item']")
          .map((i, el) => {
            return {
              title: $(el).find("a.root-48288").attr("title") || "None",
              image: $(el).find("img").attr("src") || "None",
              views: $(el).find("div.video-thumb-views").text() || "None",
              duration: $(el).find("div.tiny-8643e").last().text() || "None",
              url: $(el).find("a").attr("href") || "None",
            };
          })
          .get();
      }
    }

    const xh = new XhamsterGet();
    const data: IXhamsterVideoData = {
      success: true,
      data: {
        title: adultcolony.removeHtmlTagWithoutSpace(xh.title),
        id: xh.id,
        image: xh.image,
        duration: adultcolony.secondToMinute(Number(xh.duration)),
        views: xh.views,
        rating: xh.rating,
        uploaded: xh.publish,
        upvoted: xh.upVote,
        downvoted: xh.downVote,
      },
      related_videos: xh.related_videos,
      assets: [xh.embed, xh.video, xh.image],
      source: xh.link,
    };
    return data;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
