import { scrapeContent } from "../../services/scrapers/xasiat/xasiatSearchController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError, spacer } from "../../utils/modifier";
import { Request, Response } from "express";

export async function searchXasiat(req: Request, res: Response) {
  try {
    /**
     * @api {get} /xasiat/search Search xasiat videos
     * @apiName Search xasiat
     * @apiGroup xasiat
     * @apiDescription Search xasiat videos
     * @apiParam {String} key Keyword to search
     * @apiParam {Number} [page=0] Page number
     *
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    HTTP/1.1 400 Bad Request
     *
     * @apiExample {curl} curl
     * curl -i https://adultcolonyapi.site/xasiat/search?key=milf
     * curl -i https://adultcolonyapi.site/xasiat/search?key=milf&page=2
     *
     * @apiExample {js} JS/TS
     * import axios from "axios"
     *
     * axios.get("https://adultcolonyapi.site/xasiat/search?key=milf")
     * .then(res => console.log(res.data))
     * .catch(err => console.error(err))
     *
     * @apiExample {python} Python
     * import aiohttp
     * async with aiohttp.ClientSession() as session:
     *  async with session.get("https://adultcolonyapi.site/xasiat/search?key=milf") as resp:
     *    print(await resp.json())
     */

    const query = req.query.query as string;
    if (!query) throw Error("Parameter query is required");

    const url = `${c.XASIAT}/search/${spacer(query)}/`;
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
