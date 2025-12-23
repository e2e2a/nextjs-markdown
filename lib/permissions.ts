export type WorkspacePermissions = {
  canEdit: boolean;
  canInvite: boolean;
  canDeleteWorkspace: boolean;
};

/**
 * The "Single Source of Truth" for what roles are allowed to do.
 */
export const resolveWorkspacePermissions = (role?: string): WorkspacePermissions => {
  return {
    canEdit: role === 'admin' || role === 'editor',
    canInvite: role === 'admin' || role === 'editor',
    canDeleteWorkspace: role === 'admin',
  };
};
