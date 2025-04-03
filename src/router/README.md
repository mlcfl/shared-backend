# Router

## Description

The router is responsible for navigating requests between controllers.

Its responsibilities include:

- Routing incoming requests to the appropriate controller;
- Redirects.

The router does not handle:

- Validation of incoming data;
- Authentication;
- Rendering pages for SSR/SSG;
- Caching;
- Automatic error page responses for errors.

## Examples

```ts
// controllers.ts
import { Router, Method, GET, type Request, type Response } from "./router";

@Router()
class RootController {
	@Method(GET, "/")
	getIndex(req: Request, res: Response): Promise<Response> {
		return res.send("I am the main page");
	}
}

@Router("/api")
class ApiController {
	@Method(GET, "/getworld")
	getWorld(req: Request, res: Response): Promise<Response> {
		return res.json({ message: "Hello World" });
	}
}

// index.ts
import express from "express";
import { initRouter } from "./router";
import { RootController, ApiController } from "./controllers";

const app = express();

initRouter(app, [RootController, ApiController]);

app.listen(/* ... */);
```
