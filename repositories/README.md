# Repository Layer (`repositories/`)

## Purpose

This directory contains the **data access layer (DAL)** for the application.  
Repositories are responsible **only for database queries and persistence** — they should not contain business logic or application rules.

Repositories provide a clean interface between the **service layer** and the **database** (via Mongoose, Prisma, or direct drivers).

---

## Responsibilities

- Perform CRUD operations on specific collections or tables.
- Map database models to plain JavaScript/TypeScript objects.
- Keep all database query logic in one place.
- Never contain business logic — that belongs in `services/`.

---

## Rules

✅ **Allowed**

- `find`, `create`, `update`, `delete` database operations
- Query optimizations (projections, indexes, etc.)
- Reusable query helpers

❌ **Not Allowed**

- Input validation or data transformations
- Business rules (e.g. “send an email after save”)
- Calling other services or APIs

---

## Example Repository

```ts
/**
 * @file repositories/userRepository.ts
 * @description Handles all user-related database operations.
 */

import User from '@/models/User';

export const userRepository = {
  /**
   * Finds a user by their ID.
   * @param {string} id - User ID
   * @returns {Promise<User | null>}
   */
  async findById(id: string) {
    return await User.findById(id);
  },

  /**
   * Creates a new user record.
   * @param {object} data - User data
   * @returns {Promise<User>}
   */
  async create(data: any) {
    return await User.create(data);
  },

  /**
   * Updates a user by ID.
   * @param {string} id - User ID
   * @param {object} updates - Fields to update
   * @returns {Promise<User | null>}
   */
  async update(id: string, updates: any) {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  },
};
```
