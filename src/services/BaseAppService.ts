/**
 * Base class for application service
 * Each backend application must provide a concrete implementation
 */
export abstract class BaseAppService {
	abstract readonly appName: string;
}
