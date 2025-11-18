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

  async findMembers(filters: { projectId?: string; email?: string; invitedBy?: string }) {
    const params = new URLSearchParams();
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.email) params.append('email', filters.email);
    if (filters.invitedBy) params.append('invitedBy', filters.invitedBy);
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
  },

  async updateStatus(id: string, status: 'pending' | 'accepted' | 'rejected' | 'leave') {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },

  async deleteMember(id: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || '');
    return json;
  },
};
