# Service Layer (`services/`)

## Purpose

This directory contains all **business logic** for the application.  
Services perform operations that may involve multiple models or utilities.

## Rules

- No direct HTTP handling (no `NextRequest` / `NextResponse` here).
- Each service file should export functions used by controllers.
- Keep services **framework-agnostic** (they can be reused in scripts, tests, etc.).
- Handle validation and database interactions here.

## Example

```ts
/**
 * @file services/userService.ts
 * @description Handles business logic related to users.
 */
export const userService = {
  async createUser(data) { ... },
  async findUserById(id) { ... },
};
```
