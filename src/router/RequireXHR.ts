import { setMethodMetadata, setClassMetadata } from "./metadata";
import { validateXHR } from "./validators";

/**
 * Decorator for XHR request validation
 * Checks that the request is an AJAX request
 */
export function RequireXHR() {
	return function (
		target: any,
		context: ClassMethodDecoratorContext | ClassDecoratorContext
	) {
		// If decorator is applied to a method
		if (context.kind === "method") {
			// Store metadata for the method
			setMethodMetadata(target, String(context.name), { requireXHR: true });

			return function (this: any, req: any, res: any, ...args: any[]) {
				// Body
				if (!validateXHR(req, res)) {
					return;
				}
				// Body end

				return target.call(this, req, res, ...args);
			};
		}

		// If decorator is applied to a class
		if (context.kind === "class") {
			// Store metadata for the class
			setClassMetadata(target, { requireXHR: true });
		}

		return target;
	};
}
