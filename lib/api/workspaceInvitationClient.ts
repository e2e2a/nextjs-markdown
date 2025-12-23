const BASE_URL_INVITATIONS = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations`;
const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;

export const invitationClient = {
  async getPending() {
    const res = await fetch(`${BASE_URL_WORKSPACES}/me`);
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async create(data: {
    workspaceId: string;
    members: {
      role: 'owner' | 'editor' | 'viewer';
      email: string;
    }[];
  }) {
    const res = await fetch(`${BASE_URL_INVITATIONS}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async accept(id: string) {
    const res = await fetch(`${BASE_URL_INVITATIONS}/${id}`, { method: 'PATCH' });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async decline(id: string) {
    const res = await fetch(`${BASE_URL_INVITATIONS}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },
};
