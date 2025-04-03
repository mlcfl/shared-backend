/**
 * https://nodejs.org/api/errors.html#class-systemerror
 */
export interface SystemError extends Error {
	readonly address?: string; // if present, the address to which a network connection failed
	readonly code: string; // the string error code
	readonly dest?: string; // if present, the file path destination when reporting a file system error
	readonly errno: number; // the system-provided error number
	readonly info?: Record<string, unknown>; // if present, extra details about the error condition
	readonly message: string; // a system-provided human-readable description of the error
	readonly path?: string; // if present, the file path when reporting a file system error
	readonly port?: number; // if present, the network connection port that is not available
	readonly syscall: string; // the name of the system call that triggered the error
}
