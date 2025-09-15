import type { Methods } from "./Methods";

type Middleware = {
	type: "xhr" | "auth";
};

type Route = {
	method: Methods;
	path: string;
	handlerName: string;
	middleware?: Middleware[];
};

export const controllersList = new WeakMap<
	Function,
	{
		baseRoute: string;
		routes: Route[];
		classMiddleware?: Middleware[];
	}
>();
