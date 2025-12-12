const BASE_URL = '/api/member';
const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;
export const memberClient = {
  async leave(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/me`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },
};
