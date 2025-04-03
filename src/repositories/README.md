# Repository

## Description

The repository acts as an intermediary between the data source and the business logic.

Its responsibilities include:

- Hiding direct access to the data source (database, external service, memory, etc.);
- Separating interfaces into logical entities (UserRepository, CommentRepository, etc.).

The repository does not handle:

- Data caching;
- Data validation;
- Data normalization.

## Examples

```ts
class UserRepository extends Repository {
	static async getById(userId: number): Promise<User> {
		return this.database.select(`SELECT * FROM users WHERE id = ${userId}`);
	}
}
```
