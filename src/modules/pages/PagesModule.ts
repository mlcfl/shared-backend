import { join } from "node:path";
import {
	Inject,
	Module,
	RequestMethod,
	type DynamicModule,
	type MiddlewareConsumer,
	type NestModule,
} from "@nestjs/common";
import express from "express";
import { PagesService, FRONTEND_ROOT } from "./PagesService";

/**
 * Dynamic module that handles frontend page serving for NestJS applications.
 *
 * Responsibilities:
 * - Registers express.static middleware to serve frontend build assets
 *   (runs before all NestJS route handlers via MiddlewareConsumer)
 * - Provides PagesService for use in application-specific page controllers
 *
 * Note: PagesController is NOT registered here. Each application should
 * create its own controller (e.g. PagesController) and register it
 * in AppModule, allowing per-app route guards and redirect logic.
 */
@Module({})
export class PagesModule implements NestModule {
	private readonly publicPath: string;

	constructor(@Inject(FRONTEND_ROOT) frontendRoot: string) {
		this.publicPath = join(frontendRoot, ".output/public");
	}

	/**
	 * Registers express.static middleware to serve frontend assets from the configured public path
	 */
	configure(consumer: MiddlewareConsumer): void {
		consumer
			.apply(express.static(this.publicPath))
			.forRoutes({ path: "*", method: RequestMethod.ALL });
	}

	static forRoot(frontendRoot: string): DynamicModule {
		return {
			module: PagesModule,
			providers: [
				{ provide: FRONTEND_ROOT, useValue: frontendRoot },
				PagesService,
			],
			exports: [PagesService],
		};
	}
}
