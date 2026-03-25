import {
	applyDecorators,
	UseInterceptors,
	Injectable,
	UsePipes,
	BadRequestException,
	type NestInterceptor,
	type ExecutionContext,
	type CallHandler,
	type PipeTransform,
	type ArgumentMetadata,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import type { ZodObject, ZodRawShape } from "zod";
import type { ApiSchema } from "@shared/all";

type Decorator = MethodDecorator | ClassDecorator | PropertyDecorator;

type ReqSchema = {
	params?: ZodObject<ZodRawShape>;
	body?: ZodObject<ZodRawShape>;
};

/**
 * Decorator to validate request
 */
@Injectable()
class ZodReqPipe implements PipeTransform {
	constructor(private readonly schema: ReqSchema) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		if (metadata.type === "body" && this.schema.body) {
			const result = this.schema.body.safeParse(value);

			if (!result.success) {
				const message = result.error.errors
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join(", ");

				throw new BadRequestException(message);
			}

			return result.data;
		}

		if (metadata.type === "param" && this.schema.params) {
			const result = this.schema.params.safeParse(value);

			if (!result.success) {
				const message = result.error.errors
					.map((e) => `${e.path.join(".")}: ${e.message}`)
					.join(", ");

				throw new BadRequestException(message);
			}

			return result.data;
		}

		return value;
	}
}

/**
 * Decorator to validate response
 */
@Injectable()
class ZodResInterceptor implements NestInterceptor {
	constructor(private readonly schema: ZodObject<ZodRawShape>) {}

	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> {
		return next.handle().pipe(
			tap((value: unknown) => {
				if (value === undefined) {
					return;
				}

				const result = this.schema.safeParse(value);

				if (!result.success) {
					console.error(
						"[ValidateRes] Response validation failed:",
						result.error.errors
							.map((e) => `${e.path.join(".")}: ${e.message}`)
							.join(", "),
					);
				}
			}),
		);
	}
}

const validateReq = (req: ReqSchema) =>
	applyDecorators(UsePipes(new ZodReqPipe(req)));
const validateRes = (res: ZodObject<ZodRawShape>) =>
	applyDecorators(UseInterceptors(new ZodResInterceptor(res)));

/**
 * A decorator that applies request and response validation using Zod schemas.
 * @param schema An object containing optional `req` and `res` schemas for validation.
 */
export const ValidationSchema = (schema: ApiSchema) => {
	const decorators: Decorator[] = [];

	if (schema.req) {
		decorators.push(validateReq(schema.req));
	}

	if (schema.res) {
		decorators.push(validateRes(schema.res));
	}

	return applyDecorators(...decorators);
};
