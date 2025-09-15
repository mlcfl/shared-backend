import { setMethodMetadata, setClassMetadata } from "./metadata";
import { validateAuth } from "./validators";

/**
 * Decorator for authentication validation
 * Checks the validity of access token from cookies
 */
export function RequireAuth() {
	return function (
		target: any,
		context: ClassMethodDecoratorContext | ClassDecoratorContext
	) {
		// If decorator is applied to a method
		if (context.kind === "method") {
			// Store metadata for the method
			setMethodMetadata(target, String(context.name), { requireAuth: true });

			return async function (this: any, req: any, res: any, ...args: any[]) {
				// Body
				if (!(await validateAuth(req, res))) {
					return;
				}
				// Body end

				return target.call(this, req, res, ...args);
			};
		}

		// If decorator is applied to a class
		if (context.kind === "class") {
			// Store metadata for the class
			setClassMetadata(target, { requireAuth: true });
		}

		return target;
	};
}
