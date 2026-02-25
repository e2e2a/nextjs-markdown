import { IWorkspaceMember } from '@/types';
import { WorkspacePermissions } from '@/utils/server/permissions';

const BASE_URL_WORKSPACES = `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`;

type IResponse = {
  canLeave: boolean;
  membership: IWorkspaceMember;
  permissions: WorkspacePermissions;
  role: string;
  ownerCount: number;
};

export const projectMemberClient = {
  async getMyWorkspaceMembership(projectId: string): Promise<IResponse> {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${projectId}/members/me`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    if (res.status !== 200) throw new Error('Opps Error Occured.');
    return res.json();
  },

  async getMembersInProject(projectId: string) {
    const res = await fetch(`${BASE_URL_WORKSPACES}/${projectId}/members`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    if (res.status !== 200) throw new Error('Opps Error Occured.');
    return res.json();
  },
};
