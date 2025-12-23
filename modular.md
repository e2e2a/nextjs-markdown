# 🏗️ Modular Project Architecture (The North Star)

This document outlines the architectural rules for our "Big Project." Follow these rules to ensure the codebase remains scalable, testable, and clean.

---

## 📐 1. The Core Philosophy

We use **Modular Architecture** (Feature-based) rather than Layered Architecture (Technical-based).

- **Rule:** If a feature is "owned" by a parent, it is **nested**.
- **Rule:** If you delete a module, it should not break the core app.

---

## 📂 2. Folder Structure

All business logic lives in `src/modules`. All shared infrastructure lives in `src/lib`.

```text
src/
├── lib/                     # Shared "Plumbing"
│   ├── auth-utils.ts        # Session & Identity
│   ├── permissions.ts       # RBAC (Roles) Rules
│   └── error.ts             # Custom HttpErrors
└── modules/
    └── workspaces/          # The "Workspace" Bounded Context
        ├── member/          # Sub-module: Membership logic
        ├── invitation/      # Sub-module: Pending invites
        ├── workspace.context.ts  # Bridging Auth + Domain
        ├── workspace.service.ts  # Business Rules
        └── workspace.repository.ts # Raw DB Queries

```

---

## 🚦 3. The Dependency Flow (The "One-Way" Street)

To prevent circular dependencies, data must flow in this order only:

**API Route** **Controller** **Context (Optional)** **Service** **Repository**

> [!IMPORTANT] > **Never** call a Repository directly from a Controller.
> **Never** call a Repository from a different module; always call that module's **Service**.

---

## 🔗 4. API Design vs. Module Design

We decouple our **URL Structure** (for the User) from our **Code Structure** (for the Dev).

| Intent         | API Route (The Door)           | Logic Location (The Room)       |
| -------------- | ------------------------------ | ------------------------------- |
| **User View**  | `/api/user/me/workspaces`      | `modules/workspaces/member`     |
| **User View**  | `/api/user/me/invitations`     | `modules/workspaces/invitation` |
| **Admin View** | `/api/workspaces/[id]/members` | `modules/workspaces/member`     |

---

## 🔐 5. The "Context" Rule

The `workspace.context.ts` is the security guard for our resources.

1. **Identity:** Handled by `auth-utils` (Who is this?).
2. **Context:** Handled by `workspace.context` (What is their role in _this_ workspace?).
3. **Permissions:** Handled by `permissions.ts` (What can that role do?).

---

## 📝 6. Code Checklist (Read Every Day)

- [ ] **Is it a "me" request?** Put it under `/api/user/me/`.
- [ ] **Is the service "dumb"?** No, move business logic (status checks, etc.) from the Repository to the Service.
- [ ] **Is the Repository "smart"?** No, it should only do DB queries.
- [ ] **Are there circular imports?** If Module A needs Module B, only call Module B's Service.
- [ ] **Is the Route thin?** The route should only be 1-5 lines of code.

---

## 🚀 Next Steps

- **Would you like me to help you migrate your first existing route into this new `README.md` structure today?**
- **Or should we define the `permissions.ts` map for all your roles (Admin, Editor, Member) now?**
