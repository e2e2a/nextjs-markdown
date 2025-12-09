# API Design Guidelines: User vs Workspace Perspective

This README explains the correct design of APIs for **workspace, workspace membership, and user invitations** in a Next.js application using REST principles.

---

## 1️⃣ Key Principle

- **REST URLs should describe the primary resource first**, then the perspective or action.
- **`/me`** in URLs always refers to the **currently authenticated user**.
- **Resource ownership** determines which route it belongs to:

  - User-centric → `/api/user/me/...`
  - Workspace-centric → `/api/workspace/...`

---

## 2️⃣ User-Centric APIs (`/api/user/me/...`)

Used for **views or lists filtered by the logged-in user**.
These endpoints are usually **GET only**.

| Resource       | Endpoint                   | Method             | Notes                                   |
| -------------- | -------------------------- | ------------------ | --------------------------------------- |
| User info      | `/api/user/me`             | GET, PATCH, DELETE | Access or modify current user data      |
| My Workspaces  | `/api/user/me/workspaces`  | GET                | List all workspaces the user belongs to |
| My Invitations | `/api/user/me/invitations` | GET                | List pending invitations for the user   |

> **Note:** Only GET is used here because these are filtered views. Updates happen under the workspace or invitation resource.

---

## 3️⃣ Workspace-Centric APIs (`/api/workspace/...`)

Used for **actions or updates on a workspace or its members**.
Supports GET, POST, PATCH, DELETE depending on action.

| Resource          | Endpoint                              | Method             | Notes                                       |
| ----------------- | ------------------------------------- | ------------------ | ------------------------------------------- |
| Workspace         | `/api/workspace/:id`                  | GET, PATCH, DELETE | Fetch, update, or delete workspace          |
| Workspace Members | `/api/workspace/:id/members`          | GET                | List all members of a workspace             |
| My Membership     | `/api/workspace/:id/member/me`        | DELETE             | Current user leaves workspace               |
| My Membership     | `/api/workspace/:id/member/me`        | PATCH              | Update current user’s membership (optional) |
| Other Member      | `/api/workspace/:id/member/:memberId` | PATCH, DELETE      | Update or remove other member (owner only)  |

---

## 4️⃣ Examples

### Fetch my workspaces (user perspective)

```http
GET /api/user/me/workspaces
```

- Returns all workspaces I belong to.
- Internally: filter workspaceMember by `userId = session._id` and populate workspace info.

### Leave a workspace (workspace perspective)

```http
DELETE /api/workspace/:workspaceId/member/me
```

- Removes my membership from a specific workspace.
- Resource focus: workspace, action on “my membership”.

### Get my pending invitations

```http
GET /api/user/me/invitations
```

- Returns invitations with `status = pending` for the logged-in user.
- Resource focus: user-centric filtered view.

---

## 5️⃣ Summary Rules

1. **Use `/user/me/...` for filtered user-centric views**.
2. **Use `/workspace/...` for actual workspace resources or membership actions**.
3. **Do not PATCH or DELETE under `/user/me/...`** — update the resource owner instead.
4. **`me` always refers to the currently authenticated user**.

---

This design keeps **RESTful semantics**, **clean separation of concerns**, and avoids confusing “me” endpoints under workspace.
