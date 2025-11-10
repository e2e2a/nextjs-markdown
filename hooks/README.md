# React Query Hooks Layer (`hooks/`)

## Purpose

The `hooks/` directory contains **custom React hooks** that manage data fetching, caching, and mutations using **TanStack Query (React Query)**.

Each hook imports API functions from `lib/api/` and adds:

- Caching
- Automatic refetching
- Optimistic updates
- Error handling
- Integration with React components

---

## Responsibilities

- Encapsulate data logic for UI components.
- Keep React Query configuration consistent across the app.
- Return typed data, loading states, and mutation handlers.

---

## Folder Structure

hooks/
├── node/
│ ├── useGetNode.ts
│ ├── useUpdateNode.ts
│ └── index.ts
├── project/
│ ├── useGetProjects.ts
│ └── useCreateProject.ts

---

## Rules

✅ **Allowed**

- `useQuery`, `useMutation`, and `useQueryClient`
- React-specific side effects
- Cache invalidation logic

❌ **Not Allowed**

- Raw `fetch` or direct API calls (those belong in `lib/api`)
- Business logic (belongs in `services`)
- DOM manipulation or UI rendering

---

## Example

```ts
// hooks/node/useUpdateNode.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateNode } from '@/lib/api/node';
import type { UpdateNodeDTO } from '@/types';

export function useUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNodeDTO) => updateNode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    },
    onError: (error: Error) => {
      console.error('Failed to update node:', error.message);
    },
  });
}
```

## Usage Convention

Each feature (e.g., node, project, user) gets its own subfolder with related hooks.

Example usage inside a component:

```tsx
import { useUpdateNode } from '@/hooks/node/useUpdateNode';

function NodeEditor({ node }) {
  const { mutate, isPending } = useUpdateNode();

  const handleSave = () => {
    mutate({ _id: node._id, name: node.name });
  };

  return (
    <button onClick={handleSave} disabled={isPending}>
      Save
    </button>
  );
}
```

## Summary

| Layer           | Responsibility            | Example File      |
| --------------- | ------------------------- | ----------------- |
| **lib/api/**    | Raw HTTP client functions | `updateNode()`    |
| **hooks/**      | React Query wrappers      | `useUpdateNode()` |
| **components/** | UI / Event logic          | `NodeEditor.tsx`  |
