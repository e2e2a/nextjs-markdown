const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspace/invitation`;

export const invitationClient = {
  async getPending() {
    const res = await fetch(`${BASE_URL}/me`);
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async accept(workspaceId: string) {
    const res = await fetch(`${BASE_URL}/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId }),
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async decline(workspaceId: string) {
    const res = await fetch(`${BASE_URL}/me`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspaceId }),
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },
};
