import pg, { type PoolConfig } from "pg";
import { Db } from "./Db";

export class Postgres extends Db {
	private _pool: pg.Pool;

	constructor(config: PoolConfig) {
		super();

		this._pool = new pg.Pool(config);
	}

	get pool(): pg.Pool {
		return this._pool;
	}

	async query(raw: string, values: unknown[]) {
		return this.pool.query(raw, values);
	}
}
