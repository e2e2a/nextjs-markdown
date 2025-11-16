import { InviteMembersDTO } from '@/types';
const BASE_URL = '/api/member';

export const memberClient = {
  async inviteMember(data: InviteMembersDTO) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async findMembers(filters: { projectId?: string }) {
    const params = new URLSearchParams();
    if (filters.projectId) params.append('projectId', filters.projectId);
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },
};
