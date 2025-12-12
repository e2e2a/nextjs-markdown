// const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspace/member`;
const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;

export const workspaceMemberClient = {
  async leave(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/me`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },

  async getWorkspaceMember(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },
};
