import { load } from "cheerio";
import { IHentaiCityVideoData } from "../../../interfaces";
import AdultColony from "../../../AdultColony";
import c from "../../../utils/options";

const adultcolony = new AdultColony();

export async function scrapeContent(url: string) {
  try {
    const resolve = await adultcolony.fetchBody(url);
    const $ = load(resolve);

    class HentaiCityGet {
      title: string;
      link: string;
      image: string;
      views: string;
      upload_date: string;
      duration: string;
      rating: string;
      embed: string;
      video: string;
      episodes: {
        episode: string;
        image: string;
        link: string;
      }[];
      related_videos: {
        title: string;
        image: string;
        views: string;
        duration: string;
        url: string;
      }[];

      constructor() {
        const scriptCount = $("script").length;
        const scriptAtThirdLast =
          $("script")
            .eq(scriptCount - 11)
            .text() || "";
        const match = scriptAtThirdLast.match(/"posterImage"\s*:\s*"([^"]+)"/);
        const scriptAtFirst = $("script").eq(0).text() || "";
        let uploadDate = "None";
        let views = "None";
        let duration = "None";
        const json = JSON.parse(scriptAtFirst);

        // Extract and convert upload date
        if (json.uploadDate) {
          const date = new Date(json.uploadDate);
          uploadDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }); // Example: "Aug 24, 2024"
        }
        // Extract views
        views =
          json.interactionStatistic?.userInteractionCount?.toString() || "None";

        // Extract and convert duration
        if (json.duration) {
          const durationString = json.duration;

          const match = durationString.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

          let hours = 0;
          let minutes = 0;
          let seconds = 0;

          if (match) {
            if (match[1]) hours = parseInt(match[1], 10);
            if (match[2]) minutes = parseInt(match[2], 10);
            if (match[3]) seconds = parseInt(match[3], 10);
          }

          // Format the duration
          duration = `${
            hours > 0 ? `${hours} hr ` : ""
          }${minutes} min ${seconds} sec`;
        }

        this.title = $("section.content").find("h1").first().text() || "None";
        this.link = $("link[rel='canonical']").attr("href") || "None";
        this.image = match ? match[1] : "None";
        this.upload_date = uploadDate;
        this.views = views;
        this.duration = duration;
        this.rating =
          $(
            "span[style='float: left; margin: 0px 3px 0px 5px; line-height: 30px; padding-top: 5px; text-align: center']"
          )
            .find("div")
            .first()
            .text() || "None";
        this.embed =
          `${c.HENTAICITY}/embed/${this.link
            .split("-")
            .at(-1)
            ?.replace(".html", "")}` || "None";
        this.video = $("#video-id").find("source").attr("src") || "None";

        this.episodes = $("div.thumb-list")
          .find("div.thumb-ratio")
          .map((i, el) => {
            return {
              episode: $(el).find("span.time").text() || "None",
              image: $(el).find("img").attr("src") || "None",
              link: $(el).find("a").attr("href") || this.link,
            };
          })
          .get(); // Added .get() to convert the jQuery object to an array

        this.related_videos = $("div.outer-item")
          .find("div.item")
          .map((i, el) => {
            return {
              title: $(el).find("p.a").text() || "None",
              image: $(el).find("img").attr("src") || "None",
              views:
                $(el).find("div.info").find("span").first().text() || "None",
              duration: $(el).find("span.time").text().trim() || "None",
              url: $(el).find("a").attr("href") || "None",
            };
          })
          .get();
      }
    }

    const hc = new HentaiCityGet();
    const result: IHentaiCityVideoData = {
      success: true,
      data: {
        title: hc.title,
        link: hc.link,
        image: hc.image,
        views: hc.views,
        upload_date: hc.upload_date,
        duration: hc.duration,
        rating: hc.rating,
      },
      episodes: hc.episodes,
      assets: [hc.embed, hc.video, hc.image],
      source: url,
    };
    return result;
  } catch (err) {
    const e = err as Error;
    throw Error(e.message);
  }
}
