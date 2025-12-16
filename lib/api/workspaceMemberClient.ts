// const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspace/member`;
const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;

export const workspaceMemberClient = {
  async getMemberWithWorkspace(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/me`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    if (res.status !== 200) throw new Error('Opps Error Occured.');
    return res.json();
  },

  async leave(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/me`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },

  async getMembersInWorkspace(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    if (res.status !== 200) throw new Error('Opps Error Occured.');
    return res.json();
  },
};
