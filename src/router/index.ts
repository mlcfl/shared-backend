import type { Request as ExpressRequest } from "express";

export type { Response } from "express";
export * from "./Methods";
export * from "./Router";
export * from "./Method";
export * from "./RequireXHR";
export * from "./RequireAuth";
export * from "./initRouter";

export interface Request extends ExpressRequest {
	userId: string;
}
