import { scrapeContent } from "../../services/scrapers/javhdtoday/javhdtodayGetController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError } from "../../utils/modifier";
import { Request, Response } from "express";

export async function getJavhdToday(req: Request, res: Response) {
  try {
    const id = req.query.id as string;
    if (!id) throw Error("Parameter id is required");

    /**
     * @api {get} /xhamster/get?id=:id Get xhamster
     * @apiName Get xhamster
     * @apiGroup xhamster
     * @apiDescription Get a xhamster video based on id
     *
     * @apiParam {String} id Video ID
     *
     * @apiSuccessExample {json} Success-Response:
     *   HTTP/1.1 200 OK
     *   HTTP/1.1 400 Bad Request
     *
     * @apiExample {curl} curl
     * curl -i hhttps://adultcolonyapi.site/xhamster/get?id=260535
     *
     * @apiExample {js} JS/TS
     * import axios from "axios"
     *
     * axios.get("hhttps://adultcolonyapi.site/xhamster/get?id=260535")
     * .then(res => console.log(res.data))
     * .catch(err => console.error(err))
     *
     * @apiExample {python} Python
     * import aiohttp
     * async with aiohttp.ClientSession() as session:
     *  async with session.get("hhttps://adultcolonyapi.site/xhamster/get?id=260535") as resp:
     *    print(await resp.json())
     */

    const url = `${c.JAVHDTODAY}/${id}`;
    const data = await scrapeContent(url);

    logger.info({
      path: req.path,
      query: req.query,
      method: req.method,
      ip: req.ip,
      useragent: req.get("User-Agent"),
    });
    res.json(data);
  } catch (err) {
    const e = err as Error;
    res.status(400).json(maybeError(false, e.message));
  }
}
