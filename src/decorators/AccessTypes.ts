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
