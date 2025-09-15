import type { Express, Request, Response } from "express";
import { controllersList } from "./controllersList";
import { getClassMetadata, getMethodMetadata } from "./metadata";
import { validateXHR, validateAuth } from "./validators";

export const initRouter = (app: Express, controllers: any[]) => {
	for (const ControllerClass of controllers) {
		const instance = new ControllerClass();
		const config = controllersList.get(ControllerClass);

		if (!config) {
			continue;
		}

		const { baseRoute, routes } = config;
		const classMetadata = getClassMetadata(ControllerClass);

		for (const { method, path, handlerName } of routes) {
			const fullPath = baseRoute + path;

			// Get the original method from the instance
			let wrappedMethod = instance[handlerName];

			// Check if method has method-level decorators
			const methodMetadata = getMethodMetadata(instance, handlerName);

			// Apply class-level XHR decorator if present
			if (!methodMetadata.requireXHR && classMetadata.requireXHR) {
				const originalMethod = wrappedMethod;
				wrappedMethod = function (
					this: any,
					req: any,
					res: any,
					...args: any[]
				) {
					if (!validateXHR(req, res)) {
						return;
					}
					return originalMethod.call(this, req, res, ...args);
				};
			}

			// Apply class-level Auth decorator if present
			if (!methodMetadata.requireAuth && classMetadata.requireAuth) {
				const originalMethod = wrappedMethod;
				wrappedMethod = async function (
					this: any,
					req: any,
					res: any,
					...args: any[]
				) {
					if (!(await validateAuth(req, res))) {
						return;
					}

					return originalMethod.call(this, req, res, ...args);
				};
			}

			const handler = (req: Request, res: Response) => {
				wrappedMethod.call(instance, req, res);
			};

			app[method](fullPath, handler);
		}
	}
};
