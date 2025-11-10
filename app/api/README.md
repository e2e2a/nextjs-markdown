# API Layer (`app/api/`)

## Purpose

This directory contains the **controller layer** for the application.  
Each file handles incoming HTTP requests and delegates logic to the appropriate service.

## Rules

- Do **not** write business logic here.
- Always establish a database connection via `connectDb()`.
- Use `handleError()` for consistent error responses.
- Use `NextResponse.json()` for all responses.
- Keep functions small, declarative, and testable.

## Adding a New API Route

1. Create a new file in `app/api/` (e.g. `task.ts`).
2. Add a `@file` header JSDoc comment describing its purpose.
3. Implement `GET`, `POST`, `PUT`, `DELETE` as needed.
4. Import and call service methods for business logic.

## Example

```ts
/**
 * @file app/api/task.ts
 * @description Controller for handling task CRUD endpoints.
 */
import { taskService } from '@/services/task';
```
