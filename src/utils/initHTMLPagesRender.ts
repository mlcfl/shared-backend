import type { Express } from "express";
import { getPresetType } from "./getPresetType";
import { initSSG } from "./initSSG";
import { initSSR } from "./initSSR";

export const initHTMLPagesRender = async (
	app: Express,
	frontendRoot: string
) => {
	try {
		const { isCSRorSSG, isSSR, preset } = await getPresetType(frontendRoot);

		if (isCSRorSSG) {
			initSSG(app, frontendRoot);
			return;
		}

		if (isSSR) {
			await initSSR(app, frontendRoot);
			return;
		}

		console.warn(
			`Unknown frontend preset type: "${preset}". Server is started in API-only mode.`
		);
	} catch {
		console.warn(
			"Could not determine the frontend preset type. Server is started in API-only mode."
		);
	}
};
