# 📝 SOP: Creating an API (Route → Controller → Service → Repository)

---

## 1️⃣ When you create an API

**Definition:**

> Creating one API means you are implementing **one endpoint** (e.g., `GET /api/workspaces/:workspaceId/members/me`).
> For that API, you typically implement **all four layers**, even if “controller” can be merged into the route handler in Next.js:

```

Route Handler → Controller → Service → Repository


- **Route Handler**: HTTP layer, session, request/response
- **Controller (optional)**: input validation, maps request → service
- **Service**: business/domain logic
- **Repository**: DB queries only

> If your project is small/medium, you can merge **controller into route handler**, but **service and repository must remain separate**.

---

## 2️⃣ Step-by-step SOP

### Step 1: Define the API Route
1. Use **pluralized resources** for folders (kebab-case).
   Example:

```

GET /api/user/me/workspace-invitations

- Folder structure:

/app/api
└─ user
└─ me
└─ workspace-invitations
└─ route.ts

---

### Step 2: Route Handler

**Responsibilities:**

- Session/authentication check
- Call controller/service
- Map response → HTTP response
- Handle top-level errors

**Example:**

```ts
import { workspaceInvitationsService } from './workspaceInvitationsService';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    const invitations = await workspaceInvitationsService.getMyInvitations(session.user.id);
    return new Response(JSON.stringify(invitations), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
}
```

Step 3: Controller (optional)
Responsibilities:
Validate input (Zod, yup, etc.)
Map request data → service parameters
Translate service errors → structured errors
Example:
Step 3: Controller (optional)
Responsibilities:
Validate input (Zod, yup, etc.)
Map request data → service parameters
Translate service errors → structured errors
Example:

```
import { z } from 'zod';
import { workspaceInvitationsService } from './workspaceInvitationsService';

const getMyInvitationsSchema = z.object({
  userId: z.string().nonempty(),
});

export async function getMyInvitationsController(input: { userId: string }) {
  const parsed = getMyInvitationsSchema.parse(input);
  return workspaceInvitationsService.getMyInvitations(parsed.userId);
}

```

In Next.js, you can skip this if route handler handles validation.
Step 4: Service
Responsibilities:
Business/domain rules only
Orchestrate multiple repositories if needed
Throw errors based on domain logic (not input type)
Example:

```javascript
import { workspaceInvitationsRepository } from './workspaceInvitationsRepository';

export const workspaceInvitationsService = {
  async getMyInvitations(userId: string) {
    // Business logic: only pending invitations
    return workspaceInvitationsRepository.findByUserId(userId);
  },

  async acceptInvitation(userId: string, invitationId: string) {
    const invitation = await workspaceInvitationsRepository.findById(invitationId);
    if (!invitation) throw new Error('Invitation not found');
    if (invitation.userId !== userId) throw new Error('This invitation is not yours');
    if (invitation.status !== 'pending') throw new Error('Invitation cannot be accepted');

    invitation.status = 'accepted';
    await invitation.save();
    return invitation;
  },
};
```

Step 5: Repository

Responsibilities:

Pure DB operations only (Mongoose)

No business logic

Simple CRUD

Example:

```javascript
import { WorkspaceInvitation } from '@/models/WorkspaceInvitation';

export const workspaceInvitationsRepository = {
  findByUserId(userId: string) {
    return WorkspaceInvitation.find({ userId, status: 'pending' }).exec();
  },

  findById(invitationId: string) {
    return WorkspaceInvitation.findById(invitationId).exec();
  },
};
```

✅ Key Guidelines

Route handler = HTTP layer
Controller = input validation + mapping (optional)
Service = business logic + domain rules
Repository = DB queries only
Always keep services pure, they should not access Request or session directly.
Folder/file naming → match API path, resource, and layer type.

6️⃣ Naming conventions

✅ TL;DR

Creating 1 API = implement all 4 layers in structure (route → controller → service → repository).
Controller can be merged into route handler if small/simple.
Service handles all business rules, repository only DB.
Naming and folder structure should match the API path for clarity.
