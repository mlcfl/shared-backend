import { controllersList } from "./controllersList";
import type { Methods } from "./Methods";

export function Method(method: Methods, path: string) {
	return (originalMethod: unknown, context: ClassMethodDecoratorContext) => {
		context.addInitializer(function (this: any) {
			const parentClass = this.constructor;
			const existing = controllersList.get(parentClass) || {
				baseRoute: "",
				routes: [],
			};

			existing.routes.push({
				method,
				path,
				handlerName: String(context.name),
			});

			controllersList.set(parentClass, existing);
		});
	};
}
