import type { Request, Response } from "express";
import { TokenService } from "../services";

/**
 * Validates that the request is an XHR request
 * @param req - Express request object
 * @param res - Express response object
 * @returns true if valid, false if invalid (response already sent)
 */
export const validateXHR = (req: Request, res: Response): boolean => {
	if (!req.xhr) {
		res.sendStatus(400);
		return false;
	}

	return true;
};

/**
 * Validates authentication token and adds userId to request
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<boolean> - true if valid, false if invalid (response already sent)
 */
export const validateAuth = async (
	req: Request,
	res: Response
): Promise<boolean> => {
	const { at: accessToken } = req.cookies;
	const { id } = await TokenService.verify(accessToken);

	if (!id) {
		res.sendStatus(401);
		return false;
	}

	// Add user id to req for use in the method
	req.userId = id;

	return true;
};
