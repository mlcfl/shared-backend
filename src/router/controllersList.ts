import type { Methods } from "./Methods";

type Route = {
	method: Methods;
	path: string;
	handlerName: string;
};

export const controllersList = new WeakMap<
	Function,
	{
		baseRoute: string;
		routes: Route[];
	}
>();
