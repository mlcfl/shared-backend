import { Memory, MemoryKeys } from "../Memory";
import type { Postgres, Mongo } from "../db";

/**
 * Base repository class
 */
export abstract class Repository {
	private static _postgres: Postgres;
	private static _mongo: Mongo;

	static get postgres() {
		return this._postgres ?? (this._postgres = Memory.get(MemoryKeys.Postgres));
	}

	static get mongo() {
		return this._mongo ?? (this._mongo = Memory.get(MemoryKeys.Mongo));
	}
}
