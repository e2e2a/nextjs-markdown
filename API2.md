1. Resource: Invitations

Scenario: Handling the lifecycle of a user entering the workspace.

| Endpoint                                | Controller                                                    | Service                                                           | Repository                                                                                                                               | Scenario                                      |
| --------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| GET `/api/invitations`                  | `invitationController.getMyPendingInvitations()`              | `invitationService.listPendingInvitationsForUser(email)`          | `invitationRepository.findPendingByUserEmail(email)`                                                                                     | User views all pending invites on dashboard   |
| POST `/api/workspaces/[id]/invitations` | `invitationController.sendOrResendInvitation()`               | `invitationService.createOrResendInvitation(workspaceId, userId)` | `invitationRepository.insertOrUpdateInvitation(invitationRecord)`                                                                        | Invite new user or resend existing invitation |
| POST `/api/invitations/[id]/accept`     | `invitationController.acceptInvitationForUser(invitationId)`  | `invitationService.acceptInvitation(invitationId, userId)`        | `invitationRepository.updateInvitationStatus(invitationId, 'ACCEPTED')` + `membershipRepository.addUserToWorkspace(workspaceId, userId)` | Accept invitation; user joins workspace       |
| POST `/api/invitations/[id]/decline`    | `invitationController.declineInvitationForUser(invitationId)` | `invitationService.rejectInvitation(invitationId, userId)`        | `invitationRepository.updateInvitationStatus(invitationId, 'REJECTED')`                                                                  | Decline invitation; hide from list            |
| DELETE `/api/invitations/[id]`          | `invitationController.revokeInvitation(invitationId)`         | `invitationService.deleteInvitation(invitationId)`                | `invitationRepository.deleteInvitation(invitationId)`                                                                                    | Admin retracts an invitation                  |

2. Resource: Workspace Memberships

Scenario: Managing high-level workspace access.
| Endpoint | Controller | Service | Repository | Scenario |
| ------------------------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------- |
| GET `/api/workspaces/[id]/members/me` | `membershipController.getMyWorkspaceRole(workspaceId)` | `membershipService.retrieveUserRole(workspaceId, userId)` | `membershipRepository.findMembershipByUser(workspaceId, userId)` | Retrieve current user’s role (OWNER, ADMIN, MEMBER) |
| PATCH `/api/workspaces/[id]/members/[memberId]` | `membershipController.updateMemberRole(workspaceId, memberId)` | `membershipService.changeMemberRole(workspaceId, memberId, newRole)` | `membershipRepository.updateRole(workspaceId, memberId, newRole)` | Promote or demote a workspace member |
| DELETE `/api/workspaces/[id]/members/[memberId]` | `membershipController.removeWorkspaceMember(workspaceId, memberId)` | `membershipService.removeMemberFromWorkspace(workspaceId, memberId)` | `membershipRepository.deleteMembership(workspaceId, memberId)` | **Leave:** user exits; **Kick:** admin removes member; block sole OWNER |

3. Resource: Project Memberships

Scenario: Granular access to specific projects.
| Endpoint | Controller | Service | Repository | Scenario |
| -------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------- |
| GET `/api/projects/[id]/members/me` | `projectMembershipController.getMyProjectAccess(projectId)` | `projectMembershipService.retrieveAccessForUser(projectId, userId)` | `projectMembershipRepository.findByProjectAndUser(projectId, userId)` | Check READ/WRITE permissions |
| POST `/api/projects/[id]/members` | `projectMembershipController.assignMemberToProject(projectId, userId)` | `projectMembershipService.assignMember(projectId, userId)` | `projectMembershipRepository.insertMember(projectId, userId)` | Workspace admin adds member to project |
| DELETE `/api/projects/[id]/members/[userId]` | `projectMembershipController.unassignMemberFromProject(projectId, userId)` | `projectMembershipService.removeMember(projectId, userId)` | `projectMembershipRepository.deleteMember(projectId, userId)` | Remove user from project without affecting workspace membership | 4. Resource: Nodes (Hierarchical Core)

Scenario: Managing the file tree and content.
| Endpoint | Controller | Service | Repository | Scenario |
| ------------------------------ | ------------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------- | ------------------------------------ |
| GET `/api/projects/[id]/nodes` | `nodeController.fetchProjectTree(projectId)` | `nodeService.getHierarchicalTree(projectId)` | `nodeRepository.findTreeByProject(projectId)` | Load nested JSON of folders/files |
| POST `/api/nodes` | `nodeController.createNode(projectId, parentId, type)` | `nodeService.createNode(projectId, parentId, type)` | `nodeRepository.insertNode(nodeRecord)` | Add file or sub-folder at a location |
| PATCH `/api/nodes/[id]` | `nodeController.updateNode(nodeId, data)` | `nodeService.updateNode(nodeId, data)` | `nodeRepository.updateNode(nodeId, data)` | Edit content, rename, move nodes |
| DELETE `/api/nodes/[id]` | `nodeController.deleteNode(nodeId)` | `nodeService.deleteNodeRecursively(nodeId)` | `nodeRepository.deleteNodeAndChildren(nodeId)` | Trash folder/file recursively |

![alt text](image.png)
