import { IUserWorkspaces, IWorkspaceMemberCreateDTO } from '@/types';
const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workspaces`;

type IResponse = {
  workspaces: IUserWorkspaces[];
};

export const workspaceClient = {
  async create(data: { title: string; members: IWorkspaceMemberCreateDTO[] }) {
    const res = await fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.statusText || '');

    return res.json();
  },

  async getUserWorkspaces(): Promise<IResponse> {
    const res = await fetch(`${BASE_URL}`);
    if (!res.ok) throw new Error('Failed to fetch workspace');
    return res.json();
  },
};
