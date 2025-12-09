import { IOnboard } from '@/types';
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`;

export const userClient = {
  async onboard(data: IOnboard) {
    const res = await fetch(`${BASE_URL}/onboard`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async getUser() {
    const res = await fetch(`${BASE_URL}/me`, { cache: 'no-store' });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async getUserInvitations() {
    const res = await fetch(`${BASE_URL}/me/invitations`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },
};
