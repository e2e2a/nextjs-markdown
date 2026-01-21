export type WorkspacePermissions = {
  canEdit: boolean;
  canEditWorkspace: boolean;
  canEditMember: boolean;
  canEditProject: boolean;

  canInvite: boolean;
  canCreateProject: boolean;
  canMoveProject: boolean;

  canDeleteInvite: boolean;
  canDeleteMember: boolean;
  canDeleteWorkspace: boolean;
  canDeleteProject: boolean;
};

/**
 * The "Single Source of Truth" for what roles are allowed to do.
 */
export const resolveWorkspacePermissions = (role?: string): WorkspacePermissions => {
  return {
    canEdit: role === 'owner' || role === 'editor',
    canEditWorkspace: role === 'owner' || role === 'editor',
    canEditMember: role === 'owner' || role === 'editor',
    canEditProject: role === 'owner' || role === 'editor',

    canInvite: role === 'owner' || role === 'editor',
    canCreateProject: role === 'owner' || role === 'editor',
    canMoveProject: role === 'owner',

    canDeleteInvite: role === 'owner' || role === 'editor',
    canDeleteMember: role === 'owner' || role === 'editor',
    canDeleteWorkspace: role === 'owner',
    canDeleteProject: role === 'owner',
  };
};
