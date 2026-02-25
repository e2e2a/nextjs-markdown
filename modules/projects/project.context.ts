import { projectMemberRepository } from '@/modules/projects/member/member.repository';
import { resolveProjectPermissions, ProjectPermissions } from '@/utils/server/permissions';
import { HttpError } from '@/utils/server/errors';

export interface ProjectContext {
  membership: object | null;
  role: string;
  permissions: ProjectPermissions;
  ownerCount: number;
  canLeave: boolean;
}

/**
 * Builds the security and logic context for a specific user within a project.
 */
export async function getProjectContext(projectId: string, email: string): Promise<ProjectContext> {
  const membership = await projectMemberRepository.findOne({
    projectId,
    email,
  });

  if (!membership)
    return {
      membership: null,
      role: 'none',
      permissions: resolveProjectPermissions('none'),
      ownerCount: 0,
      canLeave: false,
    };

  // 3. Map the role to boolean capabilities
  const permissions = resolveProjectPermissions(membership.role);

  return {
    membership: membership,
    role: membership.role,
    permissions,
    ownerCount: membership.ownerCount,
    canLeave: canLeaveProject(membership.role, membership.ownerCount),
  };
}

/**
 * A "Strict" version that throws an error if the user isn't a member.
 * Useful for protected routes like "Update Settings".
 */
export async function ensureProjectMember(pid: string, email: string) {
  const context = await getProjectContext(pid, email);
  if (!context.membership) throw new HttpError('FORBIDDEN', 'You are not a member of this project');
  return context;
}

// workspace.service.ts
export const canLeaveProject = (role: string, memberCount: number): boolean => {
  if (!role) return false;
  if (role !== 'owner') return true;

  return memberCount > 1;
};
