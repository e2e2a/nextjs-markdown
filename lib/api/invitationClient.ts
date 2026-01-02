import { IUserInvitations } from '@/types';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/invitations`;

interface IReponse {
  invitations: IUserInvitations[];
}

export const invitationClient = {
  async getPending(): Promise<IReponse> {
    const res = await fetch(BASE_URL);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
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
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async accept(id: string) {
    const res = await fetch(`${BASE_URL}/${id}/accept`, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async reject(id: string) {
    const res = await fetch(`${BASE_URL}/${id}/reject`, { method: 'POST' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async trash(id: string) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) throw new Error(res.statusText || '');
    return json;
  },
};
