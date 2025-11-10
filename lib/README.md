# Library Layer (`lib/`)

## Purpose

The `lib/` directory contains **shared, framework-agnostic utilities and foundational modules** used across the application.

This layer should provide low-level functionality such as:

- Database connections
- API clients and fetch wrappers
- Helper utilities (e.g. date, formatting, validation)
- Configuration logic

## Responsibilities

- Expose reusable functions and helpers.
- Contain no React-specific or UI-related code.
- Be safe to import from anywhere (services, hooks, or routes).

## Folder Structure

lib/
├── api/ # Contains low-level API request functions
├── db/ # Database connection utilities
├── handleError.ts # Shared error handler
└── helpers.ts # Generic utility functions

## Rules

✅ **Allowed**

- Utility and helper functions
- API client abstractions
- Database or config setup

❌ **Not Allowed**

- Business logic (belongs in `services/`)
- React hooks or components
- Direct UI interactions

## Example

```ts
// lib/formatDate.ts
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
```

This ensures the lib/ layer remains small, predictable, and reusable across any part of the system.
