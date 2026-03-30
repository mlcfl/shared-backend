import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
	Injectable,
	Inject,
	type OnApplicationBootstrap,
} from "@nestjs/common";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { getPresetType } from "../../utils";

export const FRONTEND_ROOT = Symbol("FRONTEND_ROOT");

@Injectable()
export class PagesService implements OnApplicationBootstrap {
	private ssrHandler: RequestHandler | null = null;
	readonly publicPath: string;

	constructor(@Inject(FRONTEND_ROOT) private readonly frontendRoot: string) {
		this.publicPath = join(frontendRoot, ".output/public");
	}

	async onApplicationBootstrap(): Promise<void> {
		try {
			const { isCSRorSSG, isSSR, preset } = await getPresetType(
				this.frontendRoot,
			);

			if (isSSR) {
				const serverEntry = join(this.frontendRoot, ".output/server/index.mjs");
				const { href } = pathToFileURL(serverEntry);
				const { handler } = await import(href);
				this.ssrHandler = handler;
			}

			// Unknown preset — API-only mode
			if (!isCSRorSSG && !isSSR) {
				console.warn(
					`Unknown frontend preset type: "${preset}". Server is started in API-only mode.`,
				);
			}
		} catch {
			// Frontend not built — API-only mode
			console.warn(
				"Could not determine the frontend preset type. Server is started in API-only mode.",
			);
		}
	}

	handlePage(req: Request, res: Response, next: NextFunction): void {
		if (this.ssrHandler) {
			this.ssrHandler(req, res, next);
			return;
		}

		res.sendFile(join(this.publicPath, "404.html"));
	}
}
