import { scrapeContent } from "../../services/scrapers/xvideos/xvideosSearchController";
import c from "../../utils/options";
import { logger } from "../../utils/logger";
import { maybeError, spacer } from "../../utils/modifier";
import { Request, Response } from "express";

export async function searchXvideos(req: Request, res: Response) {
  try {
    /**
     * @api {get} /xvideos/search Search xvideos videos
     * @apiName Search xvideos
     * @apiGroup xvideos
     * @apiDescription Search xvideos videos
     * @apiParam {String} query queryword to search
     * @apiParam {Number} [page=0] Page number
     * 
     * @apiSuccessExample {json} Success-Response:
     *    HTTP/1.1 200 OK
     *    HTTP/1.1 400 Bad Request
     * 
     * @apiExample {curl} curl
     * curl -i https://adultcolonyapi.site/xvideos/search?query=milf
     * curl -i https://adultcolonyapi.site/xvideos/search?query=milf&page=2
     * 
     * @apiExample {js} JS/TS
     * import axios from "axios"
     * 
     * axios.get("https://adultcolonyapi.site/xvideos/search?query=milf")
     * .then(res => console.log(res.data))
     * .catch(err => console.error(err))
     * 
     * @apiExample {python} Python
     * import aiohttp
     * async with aiohttp.ClientSession() as session:
     *  async with session.get("https://adultcolonyapi.site/xvideos/search?query=milf") as resp:
     *    print(await resp.json())
     */

    const query = req.query.query as string;
    const page = req.query.page || 1;
    if (!query) throw Error("Parameter query is required");
    if (isNaN(Number(page))) throw Error("Parameter page must be a number");

    const url = `${c.XVIDEOS}/?k=${spacer(query)}&p=${page}`;
    const data = await scrapeContent(url);
    logger.info({
      path: req.path,
      query: req.query,
      method: req.method,
      ip: req.ip,
      useragent: req.get("User-Agent")
    });
    res.json(data);
  } catch (err) {
    const e = err as Error;
    res.status(400).json(maybeError(false, e.message));
  }
}