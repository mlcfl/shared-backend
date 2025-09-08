import { Router, Method, GET, type Request, type Response } from "../router";
import { Controller } from "./Controller";

@Router("/api")
export class PingController extends Controller {
	@Method(GET, "/ping")
	async ping(req: Request, res: Response) {
		return res.json("OK");
	}
}
