import {
	MongoClient,
	type MongoClientOptions,
	type Db as PoolDb,
} from "mongodb";
import { Db } from "./Db";

export class Mongo extends Db {
	private readonly _pool: MongoClient;
	private db!: PoolDb;

	constructor(uri: string, options?: MongoClientOptions) {
		super();

		this._pool = new MongoClient(uri, options);
	}

	get pool(): MongoClient {
		return this._pool;
	}

	/**
	 * Creates a pool of connections
	 */
	async connect(): Promise<void> {
		await this.pool.connect();
		this.db = this.pool.db();
	}

	async disconnect(): Promise<void> {
		await this.pool.close();
	}

	getCollection(name: string) {
		return this.db.collection(name);
	}
}
