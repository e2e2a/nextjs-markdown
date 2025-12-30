# Technical Specification: Collaborative Knowledge Graph API

This README serves as the definitive API blueprint for the Project. It defines the contract between the Next.js App Router handlers and the underlying Service/Repository layers.

---

## 0. Global Authentication Context (Next-Auth)

- **Session Requirement:** All endpoints (except public landing pages) require a valid session.
- **Identity:** Access `session.user.id` and `session.user.email` for all permission checks.
- **Multi-tenancy:** The `workspaceId` must be validated against the `workspaceMembers` table for every request.

---

## 1. Resource: Invitations

**Scenario:** Handling the lifecycle of a user entering the workspace.

- **GET `/api/invitations`**

  - **Context:** Authenticated; filter by `session.user.email`.
  - **Controller:** `invitationController.getMyPendingInvitations()`
  - **Service:** `invitation.listPendingInvitationsForUser(email)`
  - **Scenario:** User views all pending invites on their global dashboard.

- **POST `/api/workspaces/[id]/invitations`**

  - **Context:** Workspace Admin/Owner only.
  - **Controller:** `handleInviteAction`
  - **Service:** `invitation.send()` or `invitation.resend()`
  - **Scenario:** **Invite:** Create new record. **Resend:** If record exists, update `expiresAt` and trigger a new email.

- **POST `/api/invitations/[id]/accept`**

  - **Context:** User email must match invitation.
  - **Controller:** `handleAcceptance`
  - **Service:** `invitation.accept()`
  - **Repo:** `transaction([createMember, updateInviteStatus])`
  - **Scenario:** **Accept:** User joins the workspace; record moves to `workspaceMembers`.

- **POST `/api/invitations/[id]/reject`**

  - **Context:** Recipient action.
  - **Controller:** `handleRejection`
  - **Service:** `invitation.setStatus('REJECTED')`
  - **Scenario:** **Reject:** User declines the invite; it is hidden from their list.

- **DELETE `/api/invitations/[id]`**
  - **Context:** Workspace Admin action.
  - **Controller:** `handleRevoke`
  - **Service:** `invitation.delete()`
  - **Scenario:** **Revoke/Cancel:** Admin retracts an invitation sent in error.

---

## 2. Resource: Workspace Memberships

**Scenario:** Managing high-level organization access.

- **GET `/api/workspaces/[id]/members/me`**

  - **Controller:** `handleGetMyMembership`
  - **Scenario:** Retrieve current user's role (OWNER, ADMIN, MEMBER) for UI permission gating.

- **PATCH `/api/workspaces/[id]/members/[memberId]`**

  - **Controller:** `handleUpdateMemberRole`
  - **Scenario:** **Promote/Demote:** Admin changes a member's workspace permissions.

- **DELETE `/api/workspaces/[id]/members/[memberId]`**
  - **Controller:** `handleMemberRemoval`
  - **Scenario:** **Leave:** User exits. **Kick:** Admin removes user. **Constraint:** Block if user is the sole OWNER.

---

## 3. Resource: Project Memberships

**Scenario:** Granular access to specific "Obsidian-style" vaults.

- **GET `/api/projects/[id]/members/me`**

  - **Controller:** `handleGetProjectAccess`
  - **Scenario:** **Retrieve:** Check if the user has READ or WRITE access to this specific project.

- **POST `/api/projects/[id]/members`**

  - **Controller:** `handleProjectAssignment`
  - **Service:** `projectMember.assign(userId)`
  - **Scenario:** **Assign:** Workspace Admin adds a workspace member to this specific project.

- **DELETE `/api/projects/[id]/members/[userId]`**
  - **Controller:** `handleProjectUnassign`
  - **Scenario:** **Unassign:** Remove user's ability to see/edit this project without kicking them from the workspace.

---

## 4. Resource: Nodes (The Hierarchical Core)

**Scenario:** Managing the VS Code-style file tree and content.

- **GET `/api/projects/[id]/nodes`**

  - **Controller:** `handleFetchTree`
  - **Service:** `node.getHierarchicalTree(projectId)`
  - **Scenario:** **Load Sidebar:** Returns a nested JSON of folders and files for the project.

- **POST `/api/nodes`**

  - **Controller:** `handleCreateNode`
  - **Service:** `node.create(projectId, parentId, type: FILE | FOLDER)`
  - **Scenario:** **New Item:** Adds a file or sub-folder at a specific point in the tree.

- **PATCH `/api/nodes/[id]`**

  - **Controller:** `handleUpdateNode`
  - **Service:** `node.patch(data)`
  - **Scenario:** **Edit:** Save Markdown content. **Rename:** Change title. **Move:** Update `parentId` to move file to a different folder.

- **DELETE `/api/nodes/[id]`**
  - **Controller:** `handleDeleteNode`
  - **Service:** `node.deleteRecursive(nodeId)`
  - **Scenario:** **Trash:** Deleting a folder recursively removes all nested files/sub-folders.

---

## 5. Security Guardrails

### Project Isolation Logic

Every Node request must verify the `projectId`. The Service layer must confirm:
`session.user.id` is in `projectMembers` **OR** `session.user.id` is `OWNER` of the parent `workspace`.

### Data Integrity

- **Soft Deletes:** Use `deletedAt` for Nodes to allow for a "Trash/Restore" feature.
- **Cascade:** Removing a member from a Workspace must automatically trigger a cleanup of their `projectMembers` records.
