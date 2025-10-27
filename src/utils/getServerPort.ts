/**
 * Get the server port from command line arguments or environment variables.
 * Defaults to 7200 if not specified.
 */
export const getServerPort = (): number => {
	const args = process.argv.slice(2);
	const portArg = args.find((arg) => arg.startsWith("--port="));

	if (portArg) {
		try {
			return parseInt(portArg.split("=")[1]);
		} catch {
			// ignore
		}
	}

	return Number(process.env.PORT) || 7200;
};
