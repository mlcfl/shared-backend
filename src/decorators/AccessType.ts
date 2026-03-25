import {
	applyDecorators,
	UseGuards,
	Injectable,
	BadRequestException,
	UnauthorizedException,
	SetMetadata,
	type CanActivate,
	type ExecutionContext,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import jwt from "jsonwebtoken";

/**
 * The structure of the payload contained in a JWT access token.
 */
export type AccessTokenPayload = {
	id: string;
};

/**
 * Available access types for route handlers.
 * - `Any`: Both authenticated and unauthenticated users can access.
 * - `NoAuth`: Only unauthenticated users can access.
 * - `Auth`: Only authenticated users can access.
 * - `RefreshToken`: Only requests with a refresh token can access.
 */
export enum AccessTypes {
	Any = "Any",
	NoAuth = "NoAuth",
	Auth = "Auth",
	RefreshToken = "RefreshToken",
}

const ACCESS_TYPE_KEY = "accessType";

/**
 * Verifies a JWT access token using the provided public key.
 *
 * @param accessToken - The JWT access token to verify.
 * @param publicKey - The public key used for verification.
 * @returns The decoded payload if the token is valid; otherwise, an empty object.
 */
const verifyToken = (accessToken: string, publicKey: string) => {
	try {
		return jwt.verify(accessToken, publicKey, {
			algorithms: ["RS256"],
		}) as AccessTokenPayload;
	} catch {
		return {} as AccessTokenPayload;
	}
};

@Injectable()
class AccessTypeGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const type = this.reflector.get<AccessTypes>(
			ACCESS_TYPE_KEY,
			context.getHandler(),
		);
		const req = context.switchToHttp().getRequest<Request>();

		// For unauthenticated users
		if (type === AccessTypes.NoAuth) {
			if (req.cookies.at) {
				throw new BadRequestException();
			}

			return true;
		}

		// For authenticated users
		if (type === AccessTypes.Auth) {
			const publicKey = process.env.JWT_PUBLIC_KEY;

			if (!publicKey) {
				throw new UnauthorizedException();
			}

			const { id } = verifyToken(req.cookies.at, publicKey);

			if (!id) {
				throw new UnauthorizedException();
			}

			req.userId = id;

			return true;
		}

		// For requests with a refresh token
		if (type === AccessTypes.RefreshToken && !req.cookies.rt) {
			throw new BadRequestException();
		}

		// For any users and valid refresh token requests
		return true;
	}
}

/**
 * Decorator to specity the access type for a route handler.
 * @param type The access type to set for the route handler.
 */
export const AccessType = (type: AccessTypes) =>
	applyDecorators(
		SetMetadata(ACCESS_TYPE_KEY, type),
		UseGuards(AccessTypeGuard),
	);
