const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations`;

export const invitationClient = {
  async getPending() {
    const res = await fetch(BASE_URL);
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
    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async accept(id: string) {
    const res = await fetch(`${BASE_URL}/${id}/accept`, { method: 'POST' });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async reject(id: string) {
    const res = await fetch(`${BASE_URL}/${id}/reject`, { method: 'POST' });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async trash(id: string) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },
};
