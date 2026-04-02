import {
	applyDecorators,
	Catch,
	Inject,
	Injectable,
	SetMetadata,
	UseGuards,
	type ArgumentsHost,
	type CanActivate,
	type ExecutionContext,
	type ExceptionFilter,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request, Response } from "express";
import { AccessTypes } from "./AccessTypes";
import { BaseAppService } from "../services";

const PAGE_ACCESS_TYPE_KEY = "pageAccessType";

/**
 * Thrown by PageAccessGuard when a redirect is needed instead of a regular HTTP error.
 */
export class PageRedirectException {
	constructor(public readonly url: string) {}
}

/**
 * Exception filter that catches PageRedirectException and sends an HTTP redirect.
 * Registered globally via PagesModule.forRoot().
 */
@Catch(PageRedirectException)
export class PageRedirectFilter implements ExceptionFilter {
	catch(exception: PageRedirectException, host: ArgumentsHost): void {
		const res = host.switchToHttp().getResponse<Response>();
		res.redirect(exception.url);
	}
}

/**
 * Guard for page routes. Checks access type based on cookie presence
 * and redirects instead of throwing HTTP exceptions.
 *
 * - Auth + not authenticated  → redirect to token refresh endpoint on auth server
 * - NoAuth + authenticated    → redirect to "/"
 * - Any                       → always allow
 *
 * Requires Service to be provided in the application module (via AppService).
 */
@Injectable()
export class PageAccessGuard implements CanActivate {
	private readonly reflector = new Reflector();

	constructor(
		@Inject(BaseAppService) private readonly service: BaseAppService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const type = this.reflector.get<AccessTypes>(
			PAGE_ACCESS_TYPE_KEY,
			context.getHandler(),
		);
		const req = context.switchToHttp().getRequest<Request>();
		const { cookies, path } = req;
		const authenticated = Boolean(cookies.at);

		// NoAuth + authenticated → redirect to "/"
		if (type === AccessTypes.NoAuth && authenticated) {
			throw new PageRedirectException("/");
		}

		// Auth + not authenticated → redirect to token refresh endpoint on auth server
		if (type === AccessTypes.Auth && !authenticated) {
			const to = encodeURIComponent(path);
			const app = encodeURIComponent(this.service.appName);
			const refreshUrl = process.env.REFRESH_TOKEN_URL;

			throw new PageRedirectException(
				`${refreshUrl}/api/rt?app=${app}&to=${to}`,
			);
		}

		return true;
	}
}

/**
 * Decorator to specify the page access type for a route handler.
 * Works like @AccessType() but redirects instead of throwing HTTP errors.
 */
export const PageAccess = (type: AccessTypes) =>
	applyDecorators(
		SetMetadata(PAGE_ACCESS_TYPE_KEY, type),
		UseGuards(PageAccessGuard),
	);
