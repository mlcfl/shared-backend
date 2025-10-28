import type { PackageJson } from "../types";

export const getAppName = (packageJson: PackageJson) => {
	const match = packageJson.name?.match(/^@(.+)\/.+$/);

	if (!match || !match[1]) {
		throw new Error(
			'Application name from the package.json was not found. Please, check the "name" field in the package.json file. It should match "@appName/appPart".'
		);
	}

	return match[1];
};
