import { load } from "cheerio";
import AdultColony from "../../../AdultColony";
import { IVideoData } from "../../../interfaces";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class PornHubGet { 
      link: string;
      id: string;
      title: string;
      image: string;
      duration: string;
      views: string;
      rating: string;
      videoInfo: string;
      upVote: string;
      downVote: string;
      video: string;
      tags: string[];
      models: string[];
      constructor() {
        this.link = $("link[rel='canonical']").attr("href") || "None";
        this.id = this.link.split("=")[1] || "None";
        this.title = $("meta[property='og:title']").attr("content") || "None";
        this.image = $("meta[property='og:image']").attr("content") || "None";
        //get <meta property="video:duration" content="
        this.duration = $("meta[property='video:duration']").attr("content") || "0";
        this.views = $("div.views > span.count").text() || "None";
        this.rating = $("div.ratingPercent > span.percent").text() || "None";
        this.videoInfo = $("div.videoInfo").text() || "None";
        this.upVote = $("span.votesUp").attr("data-rating") || "None";
        this.downVote = $("span.votesDown").attr("data-rating") || "None";
        this.video = $("meta[property='og:video:url']").attr("content") || "None";
        this.tags = $("div.video-info-row")
          .find("a")
          .map((i, el) => {
            return $(el).text();
          }).get();
        this.tags.shift();
        this.tags = this.tags.map((el) => adultcolony.removeHtmlTagWithoutSpace(el));
        this.models = $("div.pornstarsWrapper.js-pornstarsWrapper")
          .find("a")
          .map((i, el) => {
            return $(el).attr("data-mxptext");
          }).get();
      }
    }
    
    const ph = new PornHubGet();
    const data: IVideoData = {
      success: true,
      data: {
        title: adultcolony.removeHtmlTagWithoutSpace(ph.title),
        id: ph.id,
        image: ph.image,
        duration: adultcolony.secondToMinute(Number(ph.duration)),
        views: ph.views,
        rating: ph.rating,
        uploaded: ph.videoInfo,
        upvoted: ph.upVote,
        downvoted: ph.downVote,
        models: ph.models,
        tags: ph.tags.filter((el) => el !== "Suggest" && el !== " Suggest")
      },
      source: ph.link,
      assets: [ph.video, ph.image]
    };
    return data;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}