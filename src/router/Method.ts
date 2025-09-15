import { controllersList } from "./controllersList";
import { getMethodMetadata } from "./metadata";
import type { Methods } from "./Methods";

export function Method(method: Methods, path: string) {
	return function (target: any, context: ClassMethodDecoratorContext) {
		context.addInitializer(function (this: any) {
			const parentClass = this.constructor;
			const existing = controllersList.get(parentClass) || {
				baseRoute: "",
				routes: [],
			};

			// Check method metadata for middleware presence
			const methodMetadata = getMethodMetadata(target, String(context.name));
			const methodXHR = methodMetadata.requireXHR;
			const methodAuth = methodMetadata.requireAuth;

			const middleware = [];
			if (methodXHR) {
				middleware.push({ type: "xhr" as const });
			}
			if (methodAuth) {
				middleware.push({ type: "auth" as const });
			}

			existing.routes.push({
				method,
				path,
				handlerName: String(context.name),
				middleware: middleware.length > 0 ? middleware : undefined,
			});

			controllersList.set(parentClass, existing);
		});
	};
}
