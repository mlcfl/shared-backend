import jwt from "jsonwebtoken";

export type AccessTokenPayload = {
	id: string;
};

/**
 * Verifies a JWT access token using the provided public key.
 *
 * @param accessToken - The JWT access token to verify.
 * @param publicKey - The public key used for verification.
 * @returns The decoded payload if the token is valid; otherwise, an empty object.
 */
export const verifyToken = (accessToken: string, publicKey: string) => {
	try {
		return jwt.verify(accessToken, publicKey, {
			algorithms: ["RS256"],
		}) as AccessTokenPayload;
	} catch {
		return {} as AccessTokenPayload;
	}
};
