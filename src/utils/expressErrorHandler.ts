import type { Request, Response, NextFunction } from "express";

export const expressErrorHandler = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	if (res.headersSent) {
		return;
	}

	console.error(error);
	res.status(500).send("Internal server error");
};
