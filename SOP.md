# 🧩 Next.js App Router – API Architecture SOP

> Standard Operating Procedure for API development, following **clean architecture**, **RESTful patterns**, and **scalable design principles**.

---

## 1. Folder Structure

- /app/api
  - /workspaces
    - /[workspaceId]
      - /invitations
        - /[invitationId]/accept/route.ts
        - /[invitationId]/reject/route.ts
- /services/invitationService.ts
- /repositories/invitationRepository.ts
- /controllers/invitationController.ts
- /models/invitationModel.ts

> Route Handlers: minimal HTTP logic.  
> Controllers: map request → service → response, handle validation & errors.  
> Services: business logic, orchestrates repositories.  
> Repositories: pure DB access using Mongoose.  
> Models: Mongoose schemas, no logic.

---

## 2. Layer Responsibilities

- **Route Handler**: Receives HTTP request, parses params/body, calls controller  
  Example: `/api/workspaces/:workspaceId/invitations/:invitationId/accept/route.ts`

- **Controller**: Request validation, map errors, call service  
  Example: `acceptInvitationController(req, params)`

- **Service**: Business logic, enforce rules, orchestrates repositories  
  Example: `invitationService.acceptInvitation(invitationId)`

- **Repository**: DB access only  
  Example: `invitationRepository.updateStatus(invitationId, status)`

---

## 3. Validation Rules

- Request Validation → Controller: validate IDs, required fields, types (e.g., `workspaceId` and `invitationId` are valid Mongo ObjectIds)
- Business Validation → Service: check permissions, status constraints, side-effects (e.g., only pending invitations can be accepted/rejected)

---

## 4. API Design Guidelines

### Read Endpoints (GET)

- Can be user-centric if answering “Who am I?” or “What applies to me?”
- Examples:
  - `GET /api/user/me/workspace-invitations` — invitations for authenticated user
  - `GET /api/workspaces/:workspaceId/members` — members of a workspace
  - `GET /api/workspaces/me` — workspaces the user belongs to

### Mutation Endpoints (POST / PATCH / DELETE)

- Resource-centric — the entity being modified determines the URL
- Separate endpoints for small finite actions for clarity
- Examples:
  - `POST /api/workspaces/:workspaceId/invitations/:invitationId/accept`
  - `POST /api/workspaces/:workspaceId/invitations/:invitationId/reject`
  - `DELETE /api/workspaces/:workspaceId/invitations/:invitationId`

> Controller calls shared service function with appropriate status — keeps semantic clarity even if internal logic is shared.

---

## 5. Service Layer Guidelines

- Single responsibility: implement business rules only
- Can orchestrate multiple repositories
- Must never handle HTTP request/response
- Must be fully testable
- Example:  
  `changeInvitationStatus(invitationId, status)` updates the invitation’s status, enforces business rules (cannot accept/reject non-pending invitations)

---

## 6. Controller Guidelines

- Handles request parsing & validation
- Maps service errors to HTTP responses
- Calls service layer, returns standardized response
- Example:  
  `acceptInvitationController(req, params)` validates `invitationId` and calls `changeInvitationStatus`

---

## 7. Repository Guidelines

- Only CRUD operations
- No business rules
- Use Mongoose models only
- Example:  
  `invitationRepository.updateStatus(invitationId, status)` performs DB update

---

## 8. Senior-Level Best Practices

- Separate read vs mutation endpoints clearly
- Reads can be user-centric (`/user/me/...`)
- Mutations must be resource-centric (`/workspaces/:id/...`)
- Controllers maintain validation & error mapping
- Services enforce business rules
- Repositories only handle DB
- Keep all APIs semantic, predictable, and testable

---

## 9. Summary

1. Route Handler → HTTP receiver, minimal logic
2. Controller → validation, error mapping, calls service
3. Service → business logic, orchestrates repositories
4. Repository → DB access only

> Following this SOP ensures a scalable, maintainable, and professional Next.js backend aligned with clean architecture principles.
