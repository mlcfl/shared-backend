/**
 * Express supported methods: https://expressjs.com/en/5x/api.html#routing-methods
 */
// As enum for all
export enum Methods {
	CHECKOUT = "checkout",
	COPY = "copy",
	DELETE = "delete",
	GET = "get",
	HEAD = "head",
	LOCK = "lock",
	MERGE = "merge",
	MKACTIVITY = "mkactivity",
	MKCOL = "mkcol",
	MOVE = "move",
	MSEARCH = "m-search",
	NOTIFY = "notify",
	OPTIONS = "options",
	PATCH = "patch",
	POST = "post",
	PURGE = "purge",
	PUT = "put",
	REPORT = "report",
	SEARCH = "search",
	SUBSCRIBE = "subscribe",
	TRACE = "trace",
	UNLOCK = "unlock",
	UNSUBSCRIBE = "unsubscribe",
}

// As const for each
export const CHECKOUT = Methods.CHECKOUT;
export const COPY = Methods.COPY;
export const DELETE = Methods.DELETE;
export const GET = Methods.GET;
export const HEAD = Methods.HEAD;
export const LOCK = Methods.LOCK;
export const MERGE = Methods.MERGE;
export const MKACTIVITY = Methods.MKACTIVITY;
export const MKCOL = Methods.MKCOL;
export const MOVE = Methods.MOVE;
export const MSEARCH = Methods.MSEARCH;
export const NOTIFY = Methods.NOTIFY;
export const OPTIONS = Methods.OPTIONS;
export const PATCH = Methods.PATCH;
export const POST = Methods.POST;
export const PURGE = Methods.PURGE;
export const PUT = Methods.PUT;
export const REPORT = Methods.REPORT;
export const SEARCH = Methods.SEARCH;
export const SUBSCRIBE = Methods.SUBSCRIBE;
export const TRACE = Methods.TRACE;
export const UNLOCK = Methods.UNLOCK;
export const UNSUBSCRIBE = Methods.UNSUBSCRIBE;
