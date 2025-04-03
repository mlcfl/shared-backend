import type { Express, Request, Response } from "express";
import { controllersList } from "./controllersList";

export const initRouter = (app: Express, controllers: any[]) => {
	for (const ControllerClass of controllers) {
		const instance = new ControllerClass();
		const config = controllersList.get(ControllerClass);

		if (!config) {
			continue;
		}

		const { baseRoute, routes } = config;

		for (const { method, path, handlerName } of routes) {
			const fullPath = baseRoute + path;
			const handler = (req: Request, res: Response) => {
				instance[handlerName](req, res);
			};

			app[method](fullPath, handler);
		}
	}
};
