import { IWorkspaceMember } from '@/types';
import { WorkspacePermissions } from '@/utils/permissions';

const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;

type IResponse = {
  canLeave: boolean;
  membership: IWorkspaceMember;
  permissions: WorkspacePermissions;
  role: string;
  ownerCount: number;
};
export const workspaceMemberClient = {
  async leave(data: { wid: string }) {
    const { wid } = data;
    const res = await fetch(`${BASE_URL_WORKSPACES}/${wid}/members/me/leave`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async update(data: { wid: string; mid: string; role: 'editor' | 'owner' | 'viewer' }) {
    const { wid, mid } = data;
    const res = await fetch(`${BASE_URL_WORKSPACES}/${wid}/members/${mid}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: data.role }),
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async trash(data: { wid: string; mid: string }) {
    const { wid, mid } = data;
    const res = await fetch(`${BASE_URL_WORKSPACES}/${wid}/members/${mid}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(res.statusText || '');
    return res.json();
  },

  async getMyWorkspaceMembership(workspaceId: string): Promise<IResponse> {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members/me`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    if (res.status !== 200) throw new Error('Opps Error Occured.');
    return res.json();
  },

  async getMembersInWorkspace(workspaceId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${workspaceId}/members`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    if (res.status !== 200) throw new Error('Opps Error Occured.');
    return res.json();
  },
};
