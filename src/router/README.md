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

# Router Decorators

> **Note**: Decorators use the standard TypeScript API (Stage 3) without dependency on `reflect-metadata`. Instead, a custom metadata storage based on WeakMap is used.

## Quick Start

You can use decorators:

```typescript
@Router("/api")
@RequireXHR() // All methods require XHR
export class ApiController extends Controller {
  @Method(GET, "/accounts")
  @RequireAuth() // Additional authentication validation
  async getAccounts(req: Request, res: Response) {
    // req.userId is available thanks to @RequireAuth
    return res.send({ userId: req.userId, accounts: [] });
  }
}
```

## Available Decorators

### @RequireXHR()

Checks that the request is an AJAX request (XHR). If the request is not XHR, returns status 400.

```typescript
@RequireXHR()
async someMethod(req: Request, res: Response) {
    // This code will only execute if req.xhr === true
}
```

### @RequireAuth()

Checks the validity of access token from cookies. If the token is invalid, returns status 401. On successful validation, adds `userId` to the `req` object.

```typescript
@RequireAuth()
async someMethod(req: Request, res: Response) {
    // req.userId contains the user ID after successful authentication
    console.log(req.userId);
}
```

## Decorator Application

### Method Level

Decorators can be applied to individual methods:

```typescript
@Router("/api")
export class ApiController extends Controller {
  @Method(GET, "/accounts")
  @RequireXHR()
  @RequireAuth()
  async getAccounts(req: Request, res: Response) {
    // XHR and authentication validations are performed
    return res.send({ accounts: [] });
  }
}
```

### Class Level

Decorators can be applied to the entire class:

```typescript
@Router("/api")
@RequireXHR() // All methods require XHR
export class ApiController extends Controller {
  @Method(GET, "/accounts")
  async getAccounts(req: Request, res: Response) {
    // XHR validation already performed
    return res.send({ accounts: [] });
  }

  @Method(POST, "/accounts")
  @RequireAuth() // Additional authentication validation
  async createAccount(req: Request, res: Response) {
    // XHR validation at class level + authentication at method level
    return res.send({ userId: req.userId });
  }
}
```

### Combining Decorators

You can combine decorators at class and method levels:

```typescript
@Router("/secure")
@RequireAuth() // All methods require authentication
export class SecureController extends Controller {
  @Method(GET, "/dashboard")
  @RequireXHR() // Additional XHR validation
  async getDashboard(req: Request, res: Response) {
    // Authentication at class level + XHR at method level
    return res.send({ userId: req.userId });
  }
}
```

## Execution Order

Decorators are executed in the following order:

1. Class-level decorators (top to bottom)
2. Method-level decorators (top to bottom)
3. Original method

## Usage Examples

### Controller with XHR validation at class level

```typescript
@Router("/api")
@RequireXHR()
export class ApiController extends Controller {
  @Method(GET, "/accounts")
  async getAccounts(req: Request, res: Response) {
    return res.send({ accounts: [] });
  }

  @Method(POST, "/accounts")
  @RequireAuth()
  async createAccount(req: Request, res: Response) {
    return res.send({ userId: req.userId });
  }
}
```

### Controller with authentication at class level

```typescript
@Router("/secure")
@RequireAuth()
export class SecureController extends Controller {
  @Method(GET, "/profile")
  async getProfile(req: Request, res: Response) {
    return res.send({ userId: req.userId });
  }

  @Method(GET, "/settings")
  @RequireXHR()
  async getSettings(req: Request, res: Response) {
    return res.send({ userId: req.userId });
  }
}
```

### Mixed Approach

```typescript
@Router("/mixed")
export class MixedController extends Controller {
  @Method(GET, "/public")
  async getPublic(req: Request, res: Response) {
    // No validations
    return res.send({ message: "Public data" });
  }

  @Method(POST, "/contact")
  @RequireXHR()
  async sendContact(req: Request, res: Response) {
    // Only XHR validation
    return res.send({ message: "Contact sent" });
  }

  @Method(GET, "/private")
  @RequireXHR()
  @RequireAuth()
  async getPrivate(req: Request, res: Response) {
    // XHR + authentication
    return res.send({ userId: req.userId });
  }
}
```

## Important Notes

1. **req.userId**: After successful `@RequireAuth()` validation, the `userId` property with the user ID will be available in the `req` object.

2. **Decorator Order**: The order of decorator application is important. Decorators are applied from top to bottom.

3. **Status Codes**:

   - `@RequireXHR()` returns 400 for non-XHR requests
   - `@RequireAuth()` returns 401 for invalid tokens

4. **Asynchronicity**: `@RequireAuth()` is an asynchronous decorator, so methods with this decorator must be asynchronous.
