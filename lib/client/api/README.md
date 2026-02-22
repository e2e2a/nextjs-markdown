# API Client Layer (`lib/api/`)

## Purpose

This directory contains **raw HTTP client functions** that interact directly with backend API endpoints.  
Each function performs one network request and returns the parsed response.

These modules are designed to be **reused by React Query hooks** or other services.  
They should be _stateless_, _framework-agnostic_, and contain **no React or business logic**.

---

## Responsibilities

- Perform HTTP requests using `fetch` (or another client).
- Serialize/deserialize JSON.
- Throw errors on failed requests.
- Keep all endpoint URLs in one place for easy maintenance.

---

## Folder Structure

lib/api/
├── node.ts # Node-related endpoints
├── project.ts # Project-related endpoints
└── user.ts # User-related endpoints

---

## Rules

✅ **Allowed**

- `fetch`, `axios`, or similar HTTP clients
- Type-safe DTOs (e.g. `UpdateNodeDTO`)
- Basic error handling

❌ **Not Allowed**

- React hooks (`useQuery`, `useMutation`)
- Business rules or caching logic
- Direct UI updates

---

## Example

```ts
// lib/api/node.ts
import { UpdateNodeDTO } from '@/types';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/nodes`;

/**
 * Sends a PATCH request to update a node.
 * @param {UpdateNodeDTO} data - Node update payload
 * @returns {Promise<any>} The updated node data
 * @throws {Error} If the response is not ok
 */
export async function updateNode(data: UpdateNodeDTO) {
  const res = await fetch(`${BASE_URL}/${data._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update node');
  return json;
}
```

## Usage

API functions should be imported and used inside React Query hooks or service methods.

Example:

```ts
import { updateNode } from '@/lib/api/node';
import { useMutation } from '@tanstack/react-query';

export function useUpdateNode() {
  return useMutation({ mutationFn: updateNode });
}
```
