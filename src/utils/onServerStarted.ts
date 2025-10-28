import { getServerPort } from "./getServerPort";

/**
 * Log a message when the server has started, indicating the port it's running on.
 */
export const onServerStarted =
	(defaultPort = 7200) =>
	() => {
		const port = getServerPort(defaultPort);

		console.log(`Server is started on port ${port}`);
	};
