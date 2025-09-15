import { controllersList } from "./controllersList";
import { getClassMetadata } from "./metadata";

export function Router(baseRoute: string) {
	return (target: Function, context: ClassDecoratorContext) => {
		const existing = controllersList.get(target) || { baseRoute, routes: [] };
		existing.baseRoute = baseRoute;

		// Check class metadata for middleware presence
		const classMetadata = getClassMetadata(target);
		const classXHR = classMetadata.requireXHR;
		const classAuth = classMetadata.requireAuth;

		if (classXHR || classAuth) {
			existing.classMiddleware = [];
			if (classXHR) {
				existing.classMiddleware.push({ type: "xhr" });
			}
			if (classAuth) {
				existing.classMiddleware.push({ type: "auth" });
			}
		}

		controllersList.set(target, existing);
	};
}
