import { HttpError } from '@/utils/errors';
import { resolveWorkspacePermissions, WorkspacePermissions } from '@/lib/permissions';
import { memberRepository } from '@/repositories/member';

export interface WorkspaceContext {
  isMember: boolean;
  role: string;
  permissions: WorkspacePermissions;
}

/**
 * Builds the security and logic context for a specific user within a workspace.
 */
export async function getWorkspaceContext(wid: string, uid: string): Promise<WorkspaceContext> {
  // 1. Fetch the member record from the sub-module repository
  const membership = await memberRepository.findMember(wid, uid);

  // 2. If no membership exists, they have no permissions (Guest/None)
  if (!membership)
    return {
      isMember: false,
      role: 'none',
      permissions: resolveWorkspacePermissions('none'),
    };

  // 3. Map the role to boolean capabilities
  const permissions = resolveWorkspacePermissions(membership.role);

  return {
    isMember: true,
    role: membership.role,
    permissions,
  };
}

/**
 * A "Strict" version that throws an error if the user isn't a member.
 * Useful for protected routes like "Update Settings".
 */
export async function ensureWorkspaceMember(wid: string, uid: string) {
  const context = await getWorkspaceContext(wid, uid);
  if (!context.isMember) throw new HttpError('FORBIDDEN', 'You are not a member of this workspace');

  return context;
}
