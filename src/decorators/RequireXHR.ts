import {
	applyDecorators,
	UseGuards,
	Injectable,
	BadRequestException,
	type CanActivate,
	type ExecutionContext,
} from "@nestjs/common";
import type { Request } from "express";

@Injectable()
class RequireXHRGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		if (!context.switchToHttp().getRequest<Request>().xhr) {
			throw new BadRequestException();
		}

		return true;
	}
}

/**
 * A decorator that ensures the decorated route can only be accessed via an XMLHttpRequest (XHR).
 */
export const RequireXHR = () => applyDecorators(UseGuards(RequireXHRGuard));
