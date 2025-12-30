# API Design Philosophy: Resources and Domain Actions

This API follows a **resource-oriented design**, with explicit support for **domain actions** when a simple CRUD operation is not sufficient.
The goal is to model **user intent and domain behavior**, not database operations.

---

## 1. Resource-Centric Foundation

Every primary URL represents a **resource** (a noun):

- `/api/invitations/{id}` → an invitation
- `/api/workspaces/{id}` → a workspace
- `/api/workspaces/{id}/members/{memberId}` → a workspace membership
- `/api/projects/{id}` → a project

Standard HTTP verbs are used where the intent maps cleanly:

| Verb   | Meaning                                 |
| ------ | --------------------------------------- |
| GET    | Retrieve a resource                     |
| POST   | Create a resource or trigger a workflow |
| PATCH  | Modify a resource                       |
| DELETE | Remove a resource or relationship       |

---

## 2. Why Some Endpoints End With `/accept`, `/reject`, etc.

Some operations are **not simple CRUD**.  
They represent **domain workflows or decisions**, often with side effects.

Examples:

- Accepting an invitation
- Rejecting an invitation
- Resending an invitation

These are modeled as **action sub-resources**.

### Example
