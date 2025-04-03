import type { Postgres, Mongo } from "../db";

export enum MemoryKeys {
	Postgres = "postgres",
	Mongo = "mongo",
}

export type MemoryMap = {
	[MemoryKeys.Postgres]: Postgres;
	[MemoryKeys.Mongo]: Mongo;
};

export class Memory {
	private static map: Partial<MemoryMap> = {};

	static get<T extends MemoryKeys>(key: T): MemoryMap[T] {
		const value = this.map[key];

		if (!value) {
			throw new Error(`No value found for the key: ${key}`);
		}

		return value;
	}

	static set<T extends MemoryKeys>(key: T, value: MemoryMap[T]): Memory {
		this.map[key] = value;

		return this;
	}
}
