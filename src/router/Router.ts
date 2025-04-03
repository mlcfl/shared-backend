import { controllersList } from "./controllersList";

export function Router(baseRoute: string) {
	return (target: Function) => {
		const existing = controllersList.get(target) || { baseRoute, routes: [] };
		existing.baseRoute = baseRoute;
		controllersList.set(target, existing);
	};
}
