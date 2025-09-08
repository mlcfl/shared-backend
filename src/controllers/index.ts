import { PingController } from "./PingController";
import { TokenController } from "./TokenController";

export * from "./Controller";

export const sharedControllers = [PingController, TokenController];

export * from "./PingController";
export * from "./TokenController";
