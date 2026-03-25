# Decorators

NestJS decorators for controller methods. Applied in pipeline execution order:

```
@RequireXHR()
@AccessType(type)
@ValidationSchema(schema)
async handler(...) {}
```

---

## `@RequireXHR()`

**Type:** Guard

Ensures the request was sent via XHR (`X-Requested-With: XMLHttpRequest`).
Throws `400 Bad Request` otherwise.

```typescript
@Post("signin")
@RequireXHR()
async signIn() {}
```

---

## `@AccessType(type)`

**Type:** Guard

Controls access to an endpoint based on authentication state.
Uses the `AccessTypes` enum:

| Value | Logic |
|-------|-------|
| `Any` | No checks, always passes |
| `NoAuth` | Requires absence of `at` cookie — `400` if present |
| `Auth` | Requires a valid `at` cookie (JWT RS256, key from `JWT_PUBLIC_KEY`) — `401` if invalid; sets `req.userId` |
| `RefreshToken` | Requires presence of `rt` cookie — `400` if absent |

```typescript
import { AccessType, AccessTypes } from "@shared/backend";

@Post("profile")
@AccessType(AccessTypes.Auth)
async getProfile() {}
```

---

## `@ValidationSchema(schema)`

**Type:** Pipe (req) + Interceptor (res)

Applies Zod validation using a schema of type `ApiSchema` from `@shared/all`:

- If `schema.req` is set — validates `body` and/or `params` via `ZodReqPipe`. On failure — `400 Bad Request` with details.
- If `schema.res` is set — validates the handler's return value via `ZodResInterceptor`. On failure — logs server-side (error is not returned to the client).
- If `schema.req` or `schema.res` is `null` — the corresponding validation is skipped.

The controller must use `@Res({ passthrough: true })` for the interceptor to work.

```typescript
import { ValidationSchema } from "@shared/backend";
import { signInSchema } from "shared";
import type { SignInReqBodySchema } from "shared";

@Post("signin")
@ValidationSchema(signInSchema)
async signIn(@Body() body: SignInReqBodySchema, @Res({ passthrough: true }) res: Response) {}
```
